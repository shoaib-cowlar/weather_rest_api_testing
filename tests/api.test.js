const request = require("supertest");
const app = require("../server");
const User = require("../models/user");
const bcrypt = require("bcrypt");
require("@babel/register");

describe("API Tests", () => {
  const mockUser = {
    firstName: "John",
    lastName: "Doe",
    email: "johndoe12345@example.com",
    password: "password123",
  };

  // Store the created user's ID for later use
  let userId;
  const wrongId = "64709c48138b9471a47fc9e0";
  const invalidId = "invalidUserId";
  const invalidPassword = "invalidpassword";

  // Before running the test suite, create a mock user for testing
  beforeAll(async () => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(mockUser.password, salt);

    const newUser = new User({
      firstName: mockUser.firstName,
      lastName: mockUser.lastName,
      email: mockUser.email,
      password: hashedPassword,
    });

    const savedUser = await newUser.save();
    userId = savedUser._id;
  });

  // After running the test suite, delete the mock user
  afterAll(async () => {
    await User.deleteOne({ _id: userId });
  });

  describe("POST /register", () => {
    // it("should register a new user", async () => {
    //   const response = await request(app).post("/user/register").send(mockUser);
    //   expect(response.status).toBe(200);
    //   expect(response.body).toHaveProperty("_id");
    //   expect(response.body.firstName).toBe(mockUser.firstName);
    //   expect(response.body.lastName).toBe(mockUser.lastName);
    //   expect(response.body.email).toBe(mockUser.email);
    // });

    it("should return an error for duplicate email", async () => {
      const response = await request(app).post("/user/register").send(mockUser);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe("Email is already in use");
    });
  });

  describe("POST /login", () => {
    it("should log in a user with correct credentials", async () => {
      const response = await request(app)
        .post("/user/login")
        .send({ email: mockUser.email, password: mockUser.password });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("token");
    });

    it("should return an error for incorrect email or password", async () => {
      const response = await request(app)
        .post("/user/login")
        .send({ email: mockUser.email, password: "incorrectpassword" });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe("Invalid user email or password");
    });
  });

  describe("GET /user", () => {
    it("should retrieve all user", async () => {
      const response = await request(app).get("/user/all");

      expect(response.status).toBe(200);
      expect(response.body.length).toBeGreaterThan(0);
    });
  });

  describe("GET /user/:id", () => {
    it("should retrieve a specific user by ID", async () => {
      const response = await request(app).get(`/user/${userId}`);

      expect(response.status).toBe(200);
      expect(response.body._id).toBe(userId.toString());
      expect(response.body.firstName).toBe(mockUser.firstName);
      expect(response.body.lastName).toBe(mockUser.lastName);
      expect(response.body.email).toBe(mockUser.email);
    });

    it("should return an error for in-valid user id", async () => {
      const invalidId = "invalidUserId";
      const response = await request(app).get(`/user/${invalidId}`);
      expect(response.status).toBe(400);
      expect(response.body.error).toBe("Invalid user Id");
    });

    it("should return an error for non-existent user", async () => {
      const response = await request(app).get(`/user/${wrongId}`);
      expect(response.status).toBe(404);
      expect(response.body.error).toBe("User does not exist");
    });
  });

  describe("PUT /user/:id/password", () => {
    it("should update the password of a specific user by ID", async () => {
      const newPassword = "newpassword123";
      const response = await request(app)
        .put(`/user/${userId}`)
        .send({ currentPassword: mockUser.password, newPassword });
      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Password update successful");
    });

    it("should return an error for incorrect current password", async () => {
      const response = await request(app)
        .put(`/user/${userId}`)
        .send({ currentPassword: invalidPassword, newPassword: "newpassword" });
      expect(response.status).toBe(401);
      expect(response.body.error).toBe("Incorrect password");
    });
  });

  describe("DELETE /user/:id", () => {
    it("should delete a specific user by ID", async () => {
      const response = await request(app).delete(`/user/${userId}`);
      expect(response.status).toBe(200);
      expect(response.body.message).toBe("User deleted");
    });

    it("should return an error for In Valid User id", async () => {
      const response = await request(app).delete(`/user/${invalidId}`);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe("Invalid user Id");
    });

    it("should return an error for non-existent user", async () => {
      const invalidId = "invalidUserId";
      const response = await request(app).delete(`/user/${wrongId}`);

      expect(response.status).toBe(404);
      expect(response.body.error).toBe("User does not exist");
    });
  });
});
