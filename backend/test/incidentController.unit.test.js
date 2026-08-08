const Incident = require("../models/Incident");
const User = require("../models/User");
const { findCluster } = require("../utils/clustering");
const { autoAssignResponder } = require("../utils/autoAssignment");
const incidentController = require("../controllers/incidentController");

jest.mock("../models/Incident", () => {
  const Incident = jest.fn();
  Incident.findById = jest.fn();
  return Incident;
});

jest.mock("../utils/clustering", () => ({ findCluster: jest.fn() }));
jest.mock("../models/User", () => ({ findById: jest.fn() }));
jest.mock("../utils/autoAssignment", () => ({ autoAssignResponder: jest.fn() }));
jest.mock("../utils/notificationHelper", () => ({
  notifyAssignment: jest.fn(),
  notifyStatusChange: jest.fn(),
}));

function mockResponse() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

describe("Incident controller unit tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("createIncident reuses a nearby cluster and triggers auto-assignment", async () => {
    const save = jest.fn().mockResolvedValue();
    const savedIncident = { _id: "incident-1" };
    save.mockResolvedValue(savedIncident);
    findCluster.mockResolvedValue({ _id: "cluster-1" });
    Incident.mockImplementation(function incidentModel(document) {
      Object.assign(this, document, { save });
    });

    const req = {
      user: { id: "citizen-1" },
      body: {
        type: "Flood",
        description: "Road flooded",
        severity: "High",
        latitude: "6.9271",
        longitude: "79.8612",
      },
      file: { cloudinaryUrl: "https://cloudinary.example/flood.jpg" },
    };
    const res = mockResponse();

    await incidentController.createIncident(req, res);

    expect(findCluster).toHaveBeenCalledWith(6.9271, 79.8612);
    expect(Incident).toHaveBeenCalledWith(expect.objectContaining({
      user_id: "citizen-1",
      cluster_id: "cluster-1",
      location: { type: "Point", coordinates: [79.8612, 6.9271] },
      image: "https://cloudinary.example/flood.jpg",
      status: "Pending",
    }));
    expect(autoAssignResponder).toHaveBeenCalledWith(savedIncident);
    expect(res.status).toHaveBeenCalledWith(201);
  });

  test("addIncidentFeedback rejects a second vote from the same user", async () => {
    Incident.findById.mockResolvedValue({
      verified_by: ["citizen-1"],
      reported_inaccurate_by: [],
    });
    const res = mockResponse();

    await incidentController.addIncidentFeedback({
      params: { id: "incident-1" },
      user: { id: "citizen-1" },
      body: { feedback_type: "inaccurate" },
    }, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "You have already provided feedback." });
  });

  test("addIncidentFeedback rejects feedback from the report creator", async () => {
    Incident.findById.mockResolvedValue({
      user_id: "citizen-1",
      verified_by: [],
      reported_inaccurate_by: [],
    });
    const res = mockResponse();

    await incidentController.addIncidentFeedback({
      params: { id: "incident-1" },
      user: { id: "citizen-1" },
      body: { feedback_type: "verify" },
    }, res);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      message: "You can't verify or report inaccuracy because you created this incident report.",
    });
  });

  test("addIncidentFeedback saves a verification and returns updated counts", async () => {
    const save = jest.fn();
    const incident = {
      verified_by: [],
      reported_inaccurate_by: ["citizen-2"],
      save,
    };
    save.mockResolvedValue(incident);
    Incident.findById.mockResolvedValue(incident);
    const res = mockResponse();

    await incidentController.addIncidentFeedback({
      params: { id: "incident-1" },
      user: { id: "citizen-1" },
      body: { feedback_type: "verify" },
    }, res);

    expect(incident.verified_by).toEqual(["citizen-1"]);
    expect(save).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      likes_count: 1,
      dislikes_count: 1,
    }));
  });

  test("updateResponseStatus rejects statuses outside the responder workflow", async () => {
    const res = mockResponse();

    await incidentController.updateResponseStatus({
      params: { id: "incident-1" },
      user: { id: "responder-1" },
      body: { status: "Verified" },
    }, res);

    expect(Incident.findById).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Invalid status" });
  });

  test("assignResponder creates an alert notification for a newly assigned responder", async () => {
    const save = jest.fn().mockResolvedValue();
    const incident = {
      _id: "incident-1",
      type: "Flood",
      status: "Verified",
      assignedAuthorities: [],
      status_history: [],
      save,
    };
    const responder = { _id: "responder-1", role: "Responder" };
    Incident.findById.mockResolvedValue(incident);
    User.findById.mockResolvedValue(responder);
    const res = mockResponse();

    await incidentController.assignResponder({
      params: { id: "incident-1" },
      body: { responderId: "responder-1" },
      user: { id: "admin-1" },
    }, res);

    expect(incident.assignedAuthorities).toEqual(["responder-1"]);
    expect(save).toHaveBeenCalledTimes(1);
    expect(require("../utils/notificationHelper").notifyAssignment).toHaveBeenCalledWith(
      expect.objectContaining({ assignedAuthorities: ["responder-1"] })
    );
    expect(res.status).toHaveBeenCalledWith(200);
  });

  test("declineAssignment removes only the current responder from the incident", async () => {
    const save = jest.fn().mockResolvedValue();
    const incident = {
      status: "Assigned",
      assignedAuthorities: ["responder-1", "responder-2"],
      status_history: [],
      save,
    };
    Incident.findById.mockResolvedValue(incident);
    const res = mockResponse();

    await incidentController.declineAssignment({
      params: { id: "incident-1" },
      user: { id: "responder-1" },
    }, res);

    expect(incident.assignedAuthorities).toEqual(["responder-2"]);
    expect(incident.status).toBe("Assigned");
    expect(save).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(200);
  });
});
