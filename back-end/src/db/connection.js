const environment = process.env.NODE_ENV || "development";
const config = require("../../knexfile")[environment];
const knex = require("knex")(config);

module.exports = knex;

//Allows for our connection to KNEX to work with our .env and sets the value to development also required specifications within the KNEX library such as configuration and environment variables