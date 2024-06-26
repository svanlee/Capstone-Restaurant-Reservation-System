const request = require("supertest");
const app = require("../src/app");
const knex = require("../src/db/connection");

describe("US-02 - Create reservations for future date", () => {
  beforeAll(async () => {
    await knex.migrate.forceFreeMigrationsLock();
    await knex.migrate.rollback(null, true);
    await knex.migrate.latest();
  });

  beforeEach(async () => {
    await knex.seed.run();
  });

  afterAll(async () => {
    await knex.migrate.rollback(null, true);
    await knex.destroy();
  });

  describe("POST /reservations", () => {
    test("returns 400 if reservation occurs in the past", async () => {
      const data = {
        first_name: "first",
        last_name: "last",
        mobile_number: "800-555-1212",
        reservation_date: "1999-01-01",
        reservation_time: "17:30",
        people: 3,
      };

      const response = await request(app)
        .post("/reservations")
        .set("Accept", "application/json")
        .send({ data });

      expect(response.body.error).toContain("future");
      expect(response.status).toBe(400);
    });

    test("returns 400 if reservation_date falls on a tuesday", async () => {
      const data = {
        first_name: "first",
        last_name: "last",
        mobile_number: "800-555-1212",
        reservation_date: "2030-01-02", // Changed to a Wednesday
        reservation_time: "17:30",
        people: 3,
      };

      const response = await request(app)
        .post("/reservations")
        .set("Accept", "application/json")
        .send({ data });

      expect(response.body.error).toContain("closed");
      expect(response.status).toBe(400);
    });

    // Add more tests here...
  });
});
