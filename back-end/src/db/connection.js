// Import required modules
const { NODE_ENV } = process.env;
const path = require("path");
const knex = require("knex");

// Define the environment or default to 'development'
const environment = NODE_ENV || "development";

// Set the path to the knexfile based on the environment
const configPath = path.join(__dirname, `../../knexfile.${environment}.js`);

// Import the knexfile configuration
const config = require(configPath);

// Initialize the knex instance with the configuration
const db = knex(config);

// Export the knex instance
module.exports = db;
