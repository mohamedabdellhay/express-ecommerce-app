const pool = require("../config/db.js");

const getCategories = async (req, res) => {
  try {
    const categories = await pool.query("SELECT * FROM categories");

    if (categories.rowCount > 0) {
      const result = {
        count: categories.rowCount,
        categories: categories.rows,
      };
      return res.json(result);
    } else {
      const result = {
        count: categories.rowCount,
        message: "No Categories found",
      };
      return res.status(404).json(result);
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Database connection error");
  }
};

const addCategory = async (req, res) => {
  const { ar_title, en_title, ar_description, en_description, parent, images } =
    req.body;
  if (req.categoryExist) {
    return res
      .status(403)
      .json({ status: "Rejected", message: "Category is already existed. 😐" }); // return a 404 status code
  }

  const query = `
    INSERT INTO "categories" ("ar_title", "en_title", "ar_description", "en_description", "parent", "images")
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING id`;
  const values = [
    ar_title,
    en_title,
    ar_description,
    en_description,
    parent,
    images,
  ];

  try {
    // Execute query
    const result = await pool.query(query, values);

    // send success message
    res.status(201).json({
      success: true,
      message: `Category ${en_title} added successfully`,
    });
  } catch (err) {
    // print error
    console.error("Error executing query:", err);

    // send error message to user
    res.status(500).json({
      success: false,
      message: "Failed to add category",
      error: err.message,
    });
  }
};

const deleteCategory = async (req, res) => {
  const query = `UPDATE "categories" SET "deleted" = 't' WHERE "id" = $1`;
  try {
    await pool.query(query, [req.id]);
    res.status(200).json({ status: "ok", message: "Category Deleted Success" });
  } catch (err) {
    res
      .status(503)
      .json({ status: "failed", message: `Error: ${err.message}` });
  }
  res.status(200).json({ message: "delete category page" });
};

const getCategory = async (req, res) => {
  const { id, title } = req.params;
  const query = `SELECT * FROM products WHERE category = $1`;
  const { rowCount, rows: categoryProducts } = await pool.query(query, [id]);
  if (rowCount === 0) {
    return res
      .status(404)
      .json({ status: 404, message: `No Product Found in ${title} category` });
  }
  console.log(categoryProducts);
  // console.log(id, title);
  // res.json({ message: `get category ${title}` });

  res
    .status(200)
    .json({ status: 200, count: rowCount, products: categoryProducts });
};
module.exports = { getCategories, addCategory, deleteCategory, getCategory };
