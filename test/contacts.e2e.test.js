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
    it("Should return 200 status for get all contacts", async () => {
      const res = await request(app)
        .get("/api/contacts")
        .set("Authorization", `Bearer ${token}`);
      // console.log(res.body);
      expect(res.status).toEqual(200);
      expect(res.body).toBeDefined();
      expect(res.body.data.contacts).toBeInstanceOf(Array);
    });

    it("Should return 200 status for get contact by id", async () => {
      const contact = contacts[0];
      const res = await request(app)
        .get(`/api/contacts/${contact._id}`)
        .set("Authorization", `Bearer ${token}`);
      expect(res.status).toEqual(200);
      expect(res.body).toBeDefined();
      expect(res.body.data.contact).toHaveProperty("_id");
      expect(res.body.data.contact._id).toBe(contact._id);
    });

    it("Should return 404 status for get contact by fake id", async () => {
      const fakeId = 12345;
      const res = await request(app)
        .get(`/api/contacts/${fakeId}`)
        .set("Authorization", `Bearer ${token}`);
      expect(res.status).toEqual(404);
      expect(res.body).toBeDefined();
    });
  });

  describe("Should handle post request", () => {
    it("Should return 201 status for add contact", async () => {
      const res = await request(app)
        .post("/api/contacts")
        .set("Authorization", `Bearer ${token}`)
        .send(newContact)
        .set("Accept", "application/json");
      expect(res.status).toEqual(201);
      expect(res.body).toBeDefined();
      newContactId = res.body.data.contact._id;
    });

    it("Should return 400 status for wrong field", async () => {
      const res = await request(app)
        .post("/api/contacts")
        .set("Authorization", `Bearer ${token}`)
        .send({ ...newContact, test: 1 })
        .set("Accept", "application/json");
      expect(res.status).toEqual(400);
      expect(res.body).toBeDefined();
    });

    it("Should return 400 status without required field name", async () => {
      const res = await request(app)
        .post("/api/contacts")
        .set("Authorization", `Bearer ${token}`)
        .send({ name: "Fake" })
        .set("Accept", "application/json");
      expect(res.status).toEqual(400);
      expect(res.body).toBeDefined();
    });

    it("Should return 400 status without required email field", async () => {
      const res = await request(app)
        .post("/api/contacts")
        .set("Authorization", `Bearer ${token}`)
        .send({
          email: "fake@test.com",
        })
        .set("Accept", "application/json");
      expect(res.status).toEqual(400);
      expect(res.body).toBeDefined();
    });

    it("should return 400 status without required phone field", async () => {
      const res = await request(app)
        .post("/api/contacts")
        .set("Authorization", `Bearer ${token}`)
        .send({ phone: "123456" })
        .set("Accept", "application/json");
      expect(res.status).toEqual(400);
      expect(res.body).toBeDefined();
    });
  });

  describe("Should handle patch request", () => {
    it("Should return 200 status for update contact", async () => {
      const res = await request(app)
        .patch(`/api/contacts/${newContactId}`)
        .set("Authorization", `Bearer ${token}`)
        .send({ name: "Test" })
        .set("Accept", "application/json");
      expect(res.status).toEqual(200);
      expect(res.body).toBeDefined();
      expect(res.body.data.contact.name).toBe("Test");
    });

    it("Should return 400 status for wrong field", async () => {
      const res = await request(app)
        .patch(`/api/contacts/${newContactId}`)
        .set("Authorization", `Bearer ${token}`)
        .send({ test: 1 })
        .set("Accept", "application/json");
      expect(res.status).toEqual(400);
      expect(res.body).toBeDefined();
    });

    it("should return 404 status for wrong id", async () => {
      const res = await request(app)
        .patch("/api/contacts/123456")
        .set("Authorization", `Bearer ${token}`)
        .send({ name: "Test" })
        .set("Accept", "application/json");
      expect(res.status).toEqual(404);
      expect(res.body).toBeDefined();
    });
  });

  describe("Should handle delete request", () => {
    it("Should return 200 status for delete contact", async () => {
      const res = await request(app)
        .delete(`/api/contacts/${newContactId}`)
        .set("Authorization", `Bearer ${token}`);
      expect(res.status).toEqual(200);
      expect(res.body).toBeDefined();
    });

    it("should return 404 status for wrong id", async () => {
      const res = await request(app)
        .delete("/api/contacts/123456")
        .set("Authorization", `Bearer ${token}`);
      expect(res.status).toEqual(404);
      expect(res.body).toBeDefined();
    });

    it("should return 401 status for unauthorized user", async () => {
      const res = await request(app)
        .delete(`/api/contacts/${newContactId}`)
        .set("Authorization", "Bearer 123456");
      expect(res.status).toEqual(401);
      expect(res.body).toBeDefined();
    });
  });
});
