const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const authController = require("../controllers/authController");

jest.mock("../models/User", () => {
  const User = jest.fn();
  User.findOne = jest.fn();
  return User;
});

jest.mock("bcryptjs", () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(),
}));

jest.mock("../utils/notificationService", () => ({
  sendEmail: jest.fn(),
  sendSMS: jest.fn(),
}));

function mockResponse() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

describe("Authentication controller unit tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = "test-secret";
  });

  test("register hashes the password and saves an active citizen", async () => {
    const save = jest.fn().mockResolvedValue();
    User.findOne.mockResolvedValue(null);
    bcrypt.hash.mockResolvedValue("hashed-password");
    User.mockImplementation(function userModel(document) {
      Object.assign(this, document, { save });
    });

    const req = {
      body: {
        name: "Citizen One",
        email: "citizen@example.com",
        password: "plain-password",
        role: "Citizen",
        contact_number: "0771234567",
        latitude: "6.9271",
        longitude: "79.8612",
      },
    };
    const res = mockResponse();

    await authController.register(req, res);

    expect(bcrypt.hash).toHaveBeenCalledWith("plain-password", 10);
    expect(User).toHaveBeenCalledWith(expect.objectContaining({
      password: "hashed-password",
      role: "Citizen",
      status: "Active",
      isVerified: true,
      location: { type: "Point", coordinates: [79.8612, 6.9271] },
    }));
    expect(save).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
  });

  test("login returns a one-day JWT after valid credentials", async () => {
    const user = {
      _id: "user-1",
      email: "citizen@example.com",
      password: "hashed-password",
      role: "Citizen",
      status: "Active",
    };
    User.findOne.mockResolvedValue(user);
    bcrypt.compare.mockResolvedValue(true);
    jwt.sign.mockReturnValue("signed-token");

    const res = mockResponse();
    await authController.login({ body: { email: user.email, password: "plain-password" } }, res);

    expect(jwt.sign).toHaveBeenCalledWith(
      { id: "user-1", role: "Citizen" },
      "test-secret",
      { expiresIn: "1d" }
    );
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ token: "signed-token" }));
  });

  test("login rejects a responder whose approval is still pending", async () => {
    User.findOne.mockResolvedValue({
      role: "Responder",
      status: "Pending",
    });
    const res = mockResponse();

    await authController.login({ body: { email: "responder@example.com", password: "password" } }, res);

    expect(bcrypt.compare).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      message: "Your responder account is still under review.",
    }));
  });
});
