const Incident = require("../models/Incident");
const { getHeatmapData } = require("../controllers/heatmapController");

jest.mock("../models/Incident", () => ({ find: jest.fn() }));

function mockResponse() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

describe("Heatmap controller unit tests", () => {
  beforeEach(() => jest.clearAllMocks());

  test("maps active incidents into weighted latitude/longitude heatmap points", async () => {
    Incident.find.mockResolvedValue([
      { type: "Flood", status: "Verified", location: { coordinates: [79.8612, 6.9271] } },
      { type: "Fire", status: "Assigned", location: { coordinates: [80.0, 7.0] } },
      { type: "Accident", status: "Pending", location: { coordinates: [80.1, 7.1] } },
      { type: "Invalid", status: "Pending", location: { coordinates: [80.1] } },
    ]);
    const res = mockResponse();

    await getHeatmapData({}, res);

    expect(Incident.find).toHaveBeenCalledWith({
      status: { $ne: "Resolved" },
      location: { $exists: true },
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith([
      { latitude: 6.9271, longitude: 79.8612, weight: 5, type: "Flood", status: "Verified" },
      { latitude: 7, longitude: 80, weight: 4, type: "Fire", status: "Assigned" },
      { latitude: 7.1, longitude: 80.1, weight: 2, type: "Accident", status: "Pending" },
    ]);
  });

  test("returns a server error when the incident query fails", async () => {
    Incident.find.mockRejectedValue(new Error("database unavailable"));
    const res = mockResponse();

    await getHeatmapData({}, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      message: "Failed to fetch heatmap data",
      error: "database unavailable",
    }));
  });
});
