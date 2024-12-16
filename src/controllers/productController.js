const pool = require("../config/db.js");
const Ajv = require("ajv");
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
    parent_category: {
      type: "string",
      pattern: "^[0-9]+$",
    },
    stock:{
      type: "number",
      pattern: "^[0-9]+$",
    }
  },
  required: ["ar_title", "en_title", "price", "parent_category", "stock"],
  additionalProperties: false,
};

const validate = ajv.compile(schema);

const data = {
  foo: 1,
  bar: "abc",
};

const valid = validate(data);
if (!valid) console.log(validate.errors);

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
  const valid = validate(req.body);
  if (!valid){
    return res.status(403).json({
      status: "403",
      message: "Data must be valid please check your data!"
    })
  };
  const {
    ar_title,
    en_title,
    ar_description,
    en_description,
    price,
    images,
    parent_category,
    stock
  } = req.body;



  const query = `
    INSERT INTO "products" ("ar_title", "en_title", "ar_description", "en_description", "price", "images", "parent_category", "stock") 
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING id`;

    
  const values = [ar_title, en_title, ar_description, en_description, parseInt(price, 10), images, parent_category, parseInt(stock, 10)];



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
