const pool = require("../config/db.js");
const { checkIfProductExist } = require("../services/index.js");

const getProducts = async (req, res) => {
  try {
    const products = await pool.query("SELECT * FROM products");

    if (products.rowCount > 0) {
      const result = {
        count: products.rowCount,
        products: products.rows,
      };
      return res.json(result);
    } else {
      const result = {
        count: products.rowCount,
        message: "No products found",
      };
      return res.status(404).json(result);
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Database connection error");
  }
};

const getProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await checkIfProductExist(id, res);
    console.log(product);
    res.json(product);
  } catch (err) {
    // print error
    console.error("Error executing query:", err);

    // send error message to user
    res.status(500).json({
      success: false,
      message: "Failed to get product",
      error: err.message,
    });
  }
};

const addProduct = async (req, res) => {
  const { name, description, price, stock } = req.body;

  const query = `
    INSERT INTO "products" ("name", "description", "price", "stock") 
    VALUES ($1, $2, $3, $4)
    RETURNING id`;
  const values = [name, description, parseInt(stock, 10), parseInt(price, 10)];

  try {
    // Execute query
    const result = await pool.query(query, values);

    // send success message
    res.status(201).json({
      success: true,
      message: "Product added successfully",
      product: { id: result.insertId, name, price },
    });
  } catch (err) {
    // print error
    console.error("Error executing query:", err);

    // send error message to user
    res.status(500).json({
      success: false,
      message: "Failed to add product",
      error: err.message,
    });
  }
};

const updateProduct = async (req, res) => {
  const { id } = req.params;
  const product = await checkIfProductExist(id, res);
  const { name, description, price, stock } = req.body;

  const query = ` UPDATE "products" SET "name" = $1, "description" = $2, "price" = $3, "stock" = $4 WHERE id = $5 RETURNING * `;
  const values = [
    name,
    description,
    parseInt(price, 10),
    parseInt(stock, 10),
    id,
  ];
  try {
    // Execute query
    const result = await pool.query(query, values);
    // send success message
    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product: result.rows[0],
    });
  } catch (err) {
    // print error
    console.error("Error executing query:", err);
    // send error message to user
    res.status(500).json({
      success: false,
      message: "Failed to update product",
      error: err.message,
    });
  }
};

const deleteProduct = async (req, res) => {
  const { id } = req.params;
  const product = await checkIfProductExist(id, res);
  console.log("product deleted ", id);
  // UPDATE products SET deleted = 't' WHERE id = 3
  //  DELETE FROM "products" WHERE id = $1 RETURNING *
  const query = ` UPDATE products SET deleted = 't' WHERE id = $1 RETURNING * `;
  const values = [id];
  try {
    const result = await pool.query(query, values);
    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
      product: result.rows[0],
    });
  } catch (err) {
    // print error
    console.error("Error executing query:", err);
    // send error message to user
    res.status(500).json({
      success: false,
      message: "Failed to Delete product",
      error: err.message,
    });
  }
  res.json(product);
};
module.exports = {
  getProducts,
  getProduct,
  addProduct,
  updateProduct,
  deleteProduct,
};
