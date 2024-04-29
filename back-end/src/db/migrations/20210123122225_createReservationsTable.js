// reservations.js

const { Schema } = require("objection");

class Reservation extends Schema.Model {
  static get tableName() {
    return "reservations";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["first_name", "last_name", "mobile_number", "people", "reservation_date", "reservation_time"],

      properties: {
        reservation_id: { type: "integer" },
        first_name: { type: "string", minLength: 1, maxLength: 255 },
        last_name: { type: "string", minLength: 1, maxLength: 255 },
        mobile_number: { type: "string", minLength: 10, maxLength: 15 },
        people: { type: "integer", minimum: 1 },
        reservation_date: { type: "date" },
        reservation_time: { type: "time" },
        created_at: { type: "date-time" },
        updated_at: { type: "date-time" },
      },
    };
  }
}

module.exports = {
  up: (knex) => {
    return knex.schema.createTable("reservations", (table) => {
      table.increments("reservation_id").primary();
      table.string("first_name", 255).notNullable();
      table.string("last_name", 255).notNullable();
      table.string("mobile_number", 15).notNullable();
      table.integer("people").notNullable();
      table.date("reservation_date").notNullable();
      table.time("reservation_time").notNullable();
      table.timestamps(true, true);
    });
  },

  down: (knex) => {
    return knex.schema.dropTable("reservations");
  },

  Reservation,
};
