const request = require("supertest");
const jwt = require("jsonwebtoken");
const fs = require("fs/promises");
require("dotenv").config();

const { User, newUser } = require("../model/__mocks__/data");
const app = require("../app");

const SECRET_KEY = process.env.JWT_SECRET;
const issueToken = (payload, secret) => jwt.sign(payload, secret);
const token = issueToken({ id: User._id }, SECRET_KEY);
User.token = token;

jest.mock("../model/contacts.js");
jest.mock("../model/users.js");
jest.mock("cloudinary");

describe("Testing the api/users route", () => {
  describe("Should handle post request", () => {
    it("Should return 201 status for registration", async () => {
      const res = await request(app)
        .post("/api/users/auth/register")
        .send(newUser)
        .set("Accept", "application/json");
      expect(res.status).toEqual(201);
      expect(res.body).toBeDefined();
    });

    it("Should return 409 status for registration: email is already used", async () => {
      const res = await request(app)
        .post("/api/users/auth/register")
        .send(newUser)
        .set("Accept", "application/json");
      expect(res.status).toEqual(409);
      expect(res.body).toBeDefined();
    });

    it("Should return 200 status for login", async () => {
      const res = await request(app)
        .post("/api/users/auth/login")
        .send(newUser)
        .set("Accept", "application/json");
      expect(res.status).toEqual(200);
      expect(res.body).toBeDefined();
    });

    it("Should return 401 status for unauthorized user", async () => {
      const res = await request(app)
        .post("/api/users/auth/login")
        .send({ email: "fake@test.com", password: "123456" })
        .set("Accept", "application/json");
      expect(res.status).toEqual(401);
      expect(res.body).toBeDefined();
    });

    it("Should return 204 status for logout", async () => {
      const res = await request(app)
        .post("/api/users/auth/logout")
        .set("Authorization", `Bearer ${token}`);
      expect(res.status).toEqual(204);
    });

    it("Should return  401 status for logout by unauthorized user", async () => {
      const res = await request(app)
        .post("/api/users/auth/logout")
        .send({ email: "fake@test.com", password: "123456" });
      expect(res.status).toEqual(401);
    });
  });

  describe("Should handle get request", () => {
    it("Should return 200 status for get current user", async () => {
      const res = await request(app)
        .get("/api/users/current")
        .set("Authorization", `Bearer ${token}`);
      // console.log(res.body);
      expect(res.status).toEqual(200);
    });

    it("Should return 401 status for try to get current user by unauthorized user", async () => {
      const res = await request(app)
        .get("/api/users/current")
        .send({ email: "fake@test.com", password: "123456" });
      expect(res.status).toEqual(401);
    });
  });

  describe("Should handle patch request", () => {
    it("Should return 200 status for upload avatar", async () => {
      const buffer = await fs.readFile("./test/default-av.jpg");
      const res = await request(app)
        .patch("/api/users/avatars")
        .set("Authorization", `Bearer ${token}`)
        .attach("avatar", buffer, "default-av.jpg");
      expect(res.status).toEqual(200);
      expect(res.body).toBeDefined();
    });

    it("Should return 401 status for upload avatar by unauthorized user", async () => {
      const res = await request(app)
        .patch("/api/users/avatars")
        .send({ email: "fake@test.com", password: "123456" });
      expect(res.status).toEqual(401);
      expect(res.body).toBeDefined();
    });
  });
});
