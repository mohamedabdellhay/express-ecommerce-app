const pool = require("../config/db.js");

const checkIfProductExist = async function (id, res) {
  const { rowCount, rows } = await pool.query(
    "SELECT * FROM products WHERE id = $1",
    [id]
  );
  if (rowCount === 0)
    return res.status(404).json({ message: "Product not found. 😐" }); // return a 404 status code
  return rows[0]; // return the product object
};

module.exports = { checkIfProductExist };
