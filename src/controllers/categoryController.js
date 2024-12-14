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
  const { parent_id, name, title, description, images } = req.body;

  const query = `
    INSERT INTO "categories" ("parent_id", "name", "title", "description", "images") 
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id`;
  const values = [parent_id, name, title, description, images];

  try {
    // Execute query
    const result = await pool.query(query, values);

    // send success message
    res.status(201).json({
      success: true,
      message: `Category ${name} added successfully`,
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

module.exports = { getCategories, addCategory };
