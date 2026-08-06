const jwt = require("jsonwebtoken");
const { verifyToken } = require("../middleware/authMiddleware");
const allowRoles = require("../middleware/roleMiddleware");

jest.mock("jsonwebtoken", () => ({ verify: jest.fn() }));

function mockResponse() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

describe("Authentication middleware unit tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = "test-secret";
  });

  test("verifyToken attaches a verified JWT payload to the request", () => {
    jwt.verify.mockReturnValue({ id: "user-1", role: "Admin" });
    const req = { headers: { authorization: "Bearer valid-token" } };
    const res = mockResponse();
    const next = jest.fn();

    verifyToken(req, res, next);

    expect(jwt.verify).toHaveBeenCalledWith("valid-token", "test-secret");
    expect(req.user).toEqual({ id: "user-1", role: "Admin" });
    expect(next).toHaveBeenCalled();
  });

  test("verifyToken rejects requests without an authorization header", () => {
    const res = mockResponse();

    verifyToken({ headers: {} }, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ message: "Token required" });
  });

  test("allowRoles blocks a valid user whose role is insufficient", () => {
    const res = mockResponse();
    const next = jest.fn();

    allowRoles("Admin")({ user: { role: "Citizen" } }, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });
});
