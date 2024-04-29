const tableData = require("./01-tables.json");

exports.seed = function (knex) {
  return knex.schema
    .dropTableIfExists("tables")
    .createTable("tables", (table) => {
      table.increments("id").primary();
      // add other columns here based on the schema of your JSON data
    })
    .then(() => {
      return knex("tables").insert(tableData);
    });
};
