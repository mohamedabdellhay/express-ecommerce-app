const express = require("express");
const {
  getCategories,
  addCategory,
  deleteCategory,
  getCategory,
} = require("../../controllers/categoryController");
const pool = require("../../config/db");
const { checkIfCategoryExist } = require("../../services");

const router = express.Router();

router.param("id", async (req, res, next, val) => {
  if (Number(val)) {
    console.log("valid category id....>>");
    console.log(val);
    console.log(req.method);
    if (req.method === "GET") {
      console.log("get method");
      const categoryExist = await checkIfCategoryExist(
        val.ar_title,
        val.en_title
      );
      req.id = val;
      req.categoryExist = categoryExist && true;
    } else if (req.method === "DELETE") {
      const { rowCount } = await pool.query(
        `SELECT * FROM categories WHERE id= $1`,
        [val]
      );
      if (rowCount === 0) {
        return res.status(404).json({ message: "Category not exists. 😐" }); // return a 404 status code
      }
      req.id = val;
    }

    next();
  } else {
    return res.status(503).json({ message: "bade id request" });
  }
});
router.get("/", getCategories);
router.post("/", addCategory);
router.delete("/:id", deleteCategory);
router.get("/:id/:title", getCategory);

module.exports = router;
