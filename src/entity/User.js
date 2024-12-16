
const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "User", // Entity name
  tableName: "users", // Optional: Specify the table name
  columns: {
    id: {
      type: "int",
      primary: true,
      generated: true,
    },
    name: {
      type: "varchar",
    },
    email: {
      type: "varchar",
      unique: true,
    },
    password: {
      type: "varchar",
    },
  },
});
