const Notification = require("../models/Notification");
const { notifyAssignment, notifyStatusChange } = require("../utils/notificationHelper");

jest.mock("../models/Notification", () => ({
  insertMany: jest.fn(),
  create: jest.fn(),
}));

describe("Notification helper unit tests", () => {
  beforeEach(() => jest.clearAllMocks());

  test("notifyAssignment creates one assignment notification per responder", async () => {
    await notifyAssignment({
      _id: "incident-1",
      type: "Fire",
      assignedAuthorities: ["responder-1", "responder-2"],
    });

    expect(Notification.insertMany).toHaveBeenCalledWith([
      expect.objectContaining({ user_id: "responder-1", type: "assignment", incident_id: "incident-1" }),
      expect.objectContaining({ user_id: "responder-2", type: "assignment", incident_id: "incident-1" }),
    ]);
  });

  test("notifyStatusChange notifies the reporting citizen for a resolved incident", async () => {
    await notifyStatusChange({
      _id: "incident-1",
      user_id: "citizen-1",
      type: "Flood",
      status: "Resolved",
    });

    expect(Notification.create).toHaveBeenCalledWith({
      user_id: "citizen-1",
      title: "Incident Resolved",
      description: "Your Flood incident status has been updated to Resolved.",
      type: "update",
      incident_id: "incident-1",
    });
  });

  test("notifyStatusChange ignores status changes that do not require a notification", async () => {
    await notifyStatusChange({
      _id: "incident-1",
      user_id: "citizen-1",
      type: "Flood",
      status: "In Progress",
    });

    expect(Notification.create).not.toHaveBeenCalled();
  });
});
