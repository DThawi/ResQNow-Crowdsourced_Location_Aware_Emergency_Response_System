const Incident = require("../models/Incident");
const { findCluster } = require("../utils/clustering");
const { autoAssignResponder } = require("../utils/autoAssignment");
const incidentController = require("../controllers/incidentController");

jest.mock("../models/Incident", () => {
  const Incident = jest.fn();
  Incident.findById = jest.fn();
  return Incident;
});

jest.mock("../utils/clustering", () => ({ findCluster: jest.fn() }));
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
});
