const db = require("../config/db");

const getProducts = (req, res) => {
  db.query("SELECT * FROM products", (err, results) => {
    if (err) return res.status(500).send(err);
    res.status(200).json(results);
  });
};

const addProduct = (req, res) => {
  const { name, description, price, stock } = req.body;
  db.query(
    "INSERT INTO products (name, description, price, stock) VALUES (?, ?, ?, ?)",
    [name, description, price, stock],
    (err, results) => {
      if (err) return res.status(500).send(err);
      res
        .status(201)
        .json({ message: "Product added successfully", id: results.insertId });
    }
  );
};

module.exports = { getProducts, addProduct };
