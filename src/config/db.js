const pgp = require("pg-promise")();
const dotenv = require("dotenv");
dotenv.config();

const DB_PORT = process.env.DB_PORT || 5432;
const DB_HOST = process.env.DB_HOST || "postgres";
const DB_PASSWORD = process.env.DB_PASSWORD || "example";
const DATABASE_NAME = process.env.DB_NAME || "ecommerce";
const DB_USER = process.env.DB_USER || "postgres";

const connectionOptions = {
  host: DB_HOST,
  port: DB_PORT,
  database: DATABASE_NAME,
  user: DB_USER,
  password: DB_PASSWORD,
};

// Create the database connection
const db = pgp(connectionOptions);

// Test the connection
db.connect()
  .then((obj) => {
    console.log("Connected to PostgreSQL database successfully!");
    obj.done(); // Release the connection
  })
  .catch((error) => {
    console.error("Error connecting to the database:", error);
  });

module.exports = {
  db,
  pgp,
};
