const request = require("supertest");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const { User, contacts, newContact } = require("../model/__mocks__/data");
const app = require("../app");

const SECRET_KEY = process.env.JWT_SECRET;
const issueToken = (payload, secret) => jwt.sign(payload, secret);
const token = issueToken({ id: User._id }, SECRET_KEY);
User.token = token;

jest.mock("../model/contacts.js");
jest.mock("../model/users.js");

describe("Testing the api/contacts route", () => {
  let newContactId;

  describe("Should handle get request", () => {
    it("Should return 200 status for get all contacts", async (done) => {
      const res = await request(app)
        .get("/api/contacts")
        .set("Authorization", `Bearer ${token}`);
      // console.log(res.body);
      expect(res.status).toEqual(200);
      expect(res.body).toBeDefined();
      expect(res.body.data.contacts).toBeInstanceOf(Array);
      done();
    });

    it("Should return 200 status for get contact by id", async (done) => {
      const contact = contacts[0];
      const res = await request(app)
        .get(`/api/contacts/${contact._id}`)
        .set("Authorization", `Bearer ${token}`);
      expect(res.status).toEqual(200);
      expect(res.body).toBeDefined();
      expect(res.body.data.contact).toHaveProperty("_id");
      expect(res.body.data.contact._id).toBe(contact._id);
      done();
    });

    it("Should return 404 status for get contact by fake id", async (done) => {
      const fakeId = 12345;
      const res = await request(app)
        .get(`/api/contacts/${fakeId}`)
        .set("Authorization", `Bearer ${token}`);
      expect(res.status).toEqual(404);
      expect(res.body).toBeDefined();
      done();
    });
  });

  describe("Should handle post request", () => {
    it("Should return 201 status for add contact", async (done) => {
      const res = await request(app)
        .post("/api/contacts")
        .set("Authorization", `Bearer ${token}`)
        .send(newContact)
        .set("Accept", "application/json");
      expect(res.status).toEqual(201);
      expect(res.body).toBeDefined();
      newContactId = res.body.data.contact._id;
      done();
    });

    it("Should return 400 status for wrong field", async (done) => {
      const res = await request(app)
        .post("/api/contacts")
        .set("Authorization", `Bearer ${token}`)
        .send({ ...newContact, test: 1 })
        .set("Accept", "application/json");
      expect(res.status).toEqual(400);
      expect(res.body).toBeDefined();
      done();
    });

    it("Should return 400 status without required field name", async (done) => {
      const res = await request(app)
        .post("/api/contacts")
        .set("Authorization", `Bearer ${token}`)
        .send({ name: "Fake" })
        .set("Accept", "application/json");
      expect(res.status).toEqual(400);
      expect(res.body).toBeDefined();
      done();
    });

    it("Should return 400 status without required email field ", async (done) => {
      const res = await request(app)
        .post("/api/contacts")
        .set("Authorization", `Bearer ${token}`)
        .send({
          email: "fake@test.com",
        })
        .set("Accept", "application/json");
      expect(res.status).toEqual(400);
      expect(res.body).toBeDefined();
      done();
    });

    it("should return 400 status without required phone field", async (done) => {
      const res = await request(app)
        .post("/api/contacts")
        .set("Authorization", `Bearer ${token}`)
        .send({ phone: "123456" })
        .set("Accept", "application/json");
      expect(res.status).toEqual(400);
      expect(res.body).toBeDefined();
      done();
    });
  });

  describe("Should handle patch request", () => {
    it("Should return 200 status for update contact", async (done) => {
      const res = await request(app)
        .patch(`/api/contacts/${newContactId}`)
        .set("Authorization", `Bearer ${token}`)
        .send({ name: "Test" })
        .set("Accept", "application/json");
      expect(res.status).toEqual(200);
      expect(res.body).toBeDefined();
      expect(res.body.data.contact.name).toBe("Test");
      done();
    });

    it("Should return 400 status for wrong field", async (done) => {
      const res = await request(app)
        .patch(`/api/contacts/${newContactId}`)
        .set("Authorization", `Bearer ${token}`)
        .send({ test: 1 })
        .set("Accept", "application/json");
      expect(res.status).toEqual(400);
      expect(res.body).toBeDefined();
      done();
    });

    it("should return 404 status for wrong id", async (done) => {
      const res = await request(app)
        .patch("/api/contacts/123456")
        .set("Authorization", `Bearer ${token}`)
        .send({ name: "Test" })
        .set("Accept", "application/json");
      expect(res.status).toEqual(404);
      expect(res.body).toBeDefined();
      done();
    });
  });

  describe("Should handle delete request", () => {
    it("Should return 200 status for delete contact", async (done) => {
      const res = await request(app)
        .delete(`/api/contacts/${newContactId}`)
        .set("Authorization", `Bearer ${token}`);
      expect(res.status).toEqual(200);
      expect(res.body).toBeDefined();
      done();
    });

    it("should return 404 status for wrong id", async (done) => {
      const res = await request(app)
        .delete("/api/contacts/123456")
        .set("Authorization", `Bearer ${token}`);
      expect(res.status).toEqual(404);
      expect(res.body).toBeDefined();
      done();
    });

    it("should return 401 status for unauthorized user", async (done) => {
      const res = await request(app)
        .delete(`/api/contacts/${newContactId}`)
        .set("Authorization", "Bearer 123456");
      expect(res.status).toEqual(401);
      expect(res.body).toBeDefined();
      done();
    });
  });
});
