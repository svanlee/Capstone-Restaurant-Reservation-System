/**
 * Knex configuration file.
 *
 * You will not need to make changes to this file.
 */

const path = require("path");
require("dotenv").config();

const {
  DATABASE_URL,
  DATABASE_URL_DEVELOPMENT,
  DATABASE_URL_TEST,
  DATABASE_URL_PREVIEW,
  DEBUG,
} = process.env;

const getConfig = (name) => {
  return {
    client: "postgresql",
    pool: { min: 1, max: 5 },
    connection: eval(`DATABASE_URL_${name}`),
    migrations: {
      directory: path.join(__dirname, "src", "db", "migrations"),
    },
    seeds: {
      directory: path.join(__dirname, "src", "db", "seeds"),
    },
    debug: !!DEBUG,
  };
};

module.exports = {
  development: getConfig("DEVELOPMENT"),
  test: getConfig("TEST"),
  preview: getConfig("PREVIEW"),
  production: getConfig(""),
};
