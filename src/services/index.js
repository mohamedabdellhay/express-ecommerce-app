const pool = require("../config/db.js");

const checkIfProductExist = async function (id, res) {
  const { rowCount, rows } = await pool.query(
    "SELECT * FROM products WHERE id = $1 AND deleted IS NULL",
    [id]
  );
  console.log(rowCount, rows);
  if (rowCount && rowCount === 0)
    return res.status(404).json({ message: "Product not found. 😐" }); // return a 404 status code
  return rows[0]; // return the product object
};

const checkIfCategoryExist = async function (arTitle, enTitle) {
  const query = `SELECT * FROM "categories" WHERE "ar_title" = $1 OR en_title =$2`;
  const values = [arTitle, enTitle];

  const { rowCount } = await pool.query(query, values);
  // console.log(rowCount)
  return rowCount > 0;
};

module.exports = { checkIfProductExist, checkIfCategoryExist };
