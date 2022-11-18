exports.up = function (knex) {
    return knex.schema.createTable("tables", (table) => {
      table.increments("table_id").primary();
      table.string("table_name");
      table.string("capacity");
      table.integer("reservation_id").unsigned();
      table
        .foreign("reservation_id")
        .references("reservation_id")
        .inTable("reservations");
      table.timestamps(true, true);
    });
  };
  
  exports.down = function (knex) {
    return knex.schema.dropTable("tables");
  };
  
  //Within our migrations files we are able to set up the format at which our HTML5 interacts with the front-end UI and how the data is then processed and stored in the back-end server tables created with Javascript's built in KNEX library.