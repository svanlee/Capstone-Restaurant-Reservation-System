const path = require("path");
const dotenv = require("dotenv");
const knex = require("knex");

// Load environment variables from .env file
dotenv.config({ path: path.join(__dirname, "..", ".env") });

// Initialize the Knex database connection
const db = knex({
  client: "pg",
  connection: process.env.DB_CONNECTION_STRING,
});

const migrateAndSeed = async () => {
  try {
    // Ensure no other migrations are running
    await db.migrate.forceFreeMigrationsLock();

    // Rollback any active migrations
    await db.migrate.rollback(null, true);

    // Run the latest available migration
    await db.migrate.latest();

    // Run database seeds
    await db.seed.run();

    console.log("Dropped and seeded database");
  } catch (error) {
    console.error("Failed to drop and seed database", error);
  } finally {
    // Close the database connection
    await db.destroy();
  }
};

migrateAndSeed();

