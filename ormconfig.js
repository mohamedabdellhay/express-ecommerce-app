// require("dotenv").config();
// import { DataSource } from "typeorm";

// export default new DataSource({
//   type: "postgres",
//   host: process.env.DB_HOST,
//   port: process.env.DB_PORT,
//   username: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
//   entities: ["src/entity/**/*.ts"], // enities
//   migrations: ["src/migration/**/*.ts"], // migrations
//   synchronize: false,
//   logging: true,
// });

require("dotenv").config(); // Load .env file

module.exports = {
  type: "postgres",
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 5432,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: false,
  logging: true,
  entities: ["src/entities/*.js"],
  migrations: ["src/migration/*.js"],
  cli: {
    entitiesDir: "src/entities",
    migrationsDir: "src/migration",
  },
};



// {
//   "type": "postgres",
//   "host": "DB_HOST",
//   "port": 5432,
//   "username": "your_username",
//   "password": "your_password",
//   "database": "your_database",
//   "synchronize": false,
//   "logging": true,
//   "entities": ["src/entities/*.js"], 
//   "migrations": ["src/migration/*.js"],
//   "cli": {
//     "entitiesDir": "src/entities",
//     "migrationsDir": "src/migration"
//   }
// }
