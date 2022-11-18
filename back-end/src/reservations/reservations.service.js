const knex = require("../db/connection");

function list() {
  return knex("reservations")
    .select("*")
    .whereNotIn("status", ["finished", "cancelled"])
    .orderBy("reservation_date");
}

function create(reservation) {
  return knex("reservations as r")
    .insert(reservation)
    .returning("*")
    .then((newReservation) => newReservation[0]);
}

function listByDay(date) {
  return knex("reservations")
    .select("*")
    .where({ reservation_date: date })
    .whereNot("status", "finished")
    .orderBy("reservation_time");
}

function read(reservation_id) {
  return knex("reservations")
  .select("*")
  .where({ reservation_id })
  .first();
}

//selects all from reservations table updates the status column where the reservation_id matches then sets it as the first item in the table column/row
function update(reservation_id, status) {
  return knex("reservations")
    .select("*")
    .where({ reservation_id })
    .update({ status })
    .returning("*")
    .then((updated) => updated[0]);
}

function finish(reservation_id) {
  return knex("reservations")
    .select("*")
    .where({ reservation_id })
    .update({ status: "finished" });
}

function search(mobile_number) {
  return knex("reservations")
    .whereRaw(
      "translate(mobile_number, '() -', '') like ?",
      `%${mobile_number.replace(/\D/g, "")}%`
    )
    .orderBy("reservation_date");
}


function modify(reservation_id, reservation) {
  return knex("reservations")
    .select("*")
    .where({ reservation_id })
    .update(reservation, "*")
    .returning("*")
    .then((updated) => updated[0]);
}

/*Exports allows for the functionality in our service file to be called in our controller file to access the data
in the backend with express guiding where Knex to select, manipulate tables */

module.exports = {
  list,
  create,
  listByDay,
  read,
  finish,
  update,
  search,
  modify,
};