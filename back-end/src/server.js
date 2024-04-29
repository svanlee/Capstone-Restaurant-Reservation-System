const { PORT = 5001 } = process.env;
const app = require("./app");
const knex = require("./db/connection");

const migrateAndListen = async () => {
  try {
    await knex.migrate.latest();
    console.log("Database migrations completed.");
    app.listen(PORT, () => {
      console.log(`Listening on port ${PORT}...`);
    });
  } catch (error) {
    console.error("Error during migration or server start:", error);
    knex.destroy();
    process.exit(1);
  }
};

migrateAndListen();

