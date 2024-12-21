require("dotenv").config();
const pool = require("../config/db.js");
const Ajv = require("ajv");
const redis = require("redis");
const { createClient } = require("redis");
const { checkIfProductExist } = require("../services/index.js");

// validate data using AJV
const ajv = new Ajv(); // options can be passed, e.g. {allErrors: true}
const schema = {
  type: "object",
  properties: {
    id: {
      type: "string",
      pattern: "^[0-9]+$",
    },
    ar_title: {
      type: "string",
      minLength: 1,
    },
    en_title: {
      type: "string",
      minLength: 1,
    },
    ar_description: {
      type: "string",
      minLength: 1,
    },
    en_description: {
      type: "string",
      minLength: 1,
    },
    price: {
      type: "number",
      minimum: 0,
    },
    images: {
      type: "string",
      minLength: 1,
    },
    category: {
      type: "number",
      pattern: "^[0-9]+$",
    },
    stock: {
      type: "number",
      pattern: "^[0-9]+$",
    },
    deleted: {
      type: "string",
      minLength: 1,
    },
  },
  required: ["ar_title", "en_title", "price", "category", "stock"],
  additionalProperties: false,
};

// get all products from products table
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

// get single product
const getProduct = async (req, res) => {
  const { id } = req.params;
  try {
    res.json(req.product);
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to get product",
      error: err.message,
    });
  }
};

// add new products
const addProduct = async (req, res) => {
  const valid = ajv.validate(schema, req.body);
  if (!valid) {
    console.log(ajv.errors);
    return res.status(403).json({
      status: "403",
      message: ajv.errors,
    });
  }
  const {
    ar_title,
    en_title,
    ar_description,
    en_description,
    price,
    images,
    category,
    stock,
  } = req.body;

  const query = `
    INSERT INTO "products" ("ar_title", "en_title", "ar_description", "en_description", "price", "images", "category", "stock") 
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING id`;

  const values = [
    ar_title,
    en_title,
    ar_description,
    en_description,
    parseInt(price, 10),
    images,
    category,
    parseInt(stock, 10),
  ];

  try {
    // Execute query
    const result = await pool.query(query, values);

    // send success message
    res.status(201).json({
      success: true,
      message: "Product added successfully",
      product: { id: result.insertId, en_title, price },
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

// Function to update an existing product
const updateProduct = async (req, res) => {
  try {
    // Destructure request body with fallback to existing values
    const product = req.product;
    const {
      id = product.id,
      ar_title = product.ar_title,
      en_title = product.en_title,
      ar_description = product.ar_description,
      en_description = product.en_description,
      price = product.price,
      images = product.images,
      category = product.category,
      stock = product.stock,
      deleted = product.deleted,
    } = req.body;

    // Query and values for updating the product
    const query = `
      UPDATE products
      SET 
        ar_title = $1,
        en_title = $2,
        ar_description = $3,
        en_description = $4,
        price = $5,
        images = $6,
        category = $7,
        stock = $8,
        deleted = $9
      WHERE id = $10
      RETURNING *;
    `;
    const values = [
      ar_title,
      en_title,
      ar_description,
      en_description,
      parseInt(price, 10),
      images,
      category,
      parseInt(stock, 10),
      deleted,
      id,
    ];

    // Execute the query
    const result = await pool.query(query, values);

    // Send success response
    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product: result.rows[0],
    });
  } catch (error) {
    // console.error("Error updating product:", error.message);
    res.status(500).json({
      success: false,
      message: "An error occurred while updating the product",
      error: error.message,
    });
  }
};

// Function to delete existing product
const deleteProduct = async (req, res) => {
  const { id } = req.params;
  const product = await checkIfProductExist(id, res);
  console.log("product deleted ", id);
  if (!product)
    return res.status(404).json({ message: "Product not found. 😐" }); // return a 404 status code
  const query = ` UPDATE products SET deleted = 't' WHERE id = $1 RETURNING * `;
  const values = [id];
  try {
    const result = await pool.query(query, values);
    return res.status(200).json({
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

// Function to get top products using redis caching
const topProducts = async (req, res) => {
  const query = `SELECT * FROM "products" WHERE "sales_count" != '0' ORDER BY "sales_count" DESC LIMIT 50`;
  try {
    const client = createClient({
      url: `redis://redis:${process.env.REDIS_PORT}`,
    });

    await client.connect();

    const cachedData = await client.get("topProducts");

    if (cachedData) {
      return res.json(JSON.parse(cachedData));
    } else {
      const { rows: products } = await pool.query(query);

      await client.setEx("topProducts", 3600, JSON.stringify(products));

      return res.json(products);
    }
  } catch (error) {
    console.error("Error fetching top products:", error);
    return res
      .status(500)
      .json({ message: "Error fetching top products", error });
  } finally {
    await client.quit();
  }
};

// get top products from top products table
const getTopProducts = async (req, res) => {
  const query = `
              SELECT
              p.id AS product_id,
              p.ar_title,
              p.en_title,
              p.price,
              p.images,
              p.category,
              p.stock,
              tp.sales_count
            FROM
              products p
            JOIN
              top_products tp ON p.id = tp.product_id
            WHERE
              p.deleted IS NULL
            ORDER BY
              tp.sales_count DESC
            LIMIT 5;
          `;
  try {
    const response = await pool.query(query);
    res.json(response.rows);
  } catch (error) {
    console.error("Error executing query", error.stack);
  }
};

module.exports = {
  getProducts,
  getProduct,
  addProduct,
  updateProduct,
  deleteProduct,
  getTopProducts,
};
