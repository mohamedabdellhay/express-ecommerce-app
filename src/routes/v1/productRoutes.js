const express = require("express");
const {
  getProducts,
  getProduct,
  addProduct,
  updateProduct,
  deleteProduct,
} = require("../../controllers/productController");
const { checkIfProductExist } = require("../../services");
const router = express.Router();

// check id middleware
router.param("id", async (req, res, next, val) => {
  if (Number(val)) {
    // first chick if product exists
    const product = await checkIfProductExist(val, res);
    if (!product)
      return res.status(404).json({ message: "Product not found. 😐" }); // return a 404 status code
    req.product = product;
    // second  redirect request to the next step
    next();
  } else {
    return res.status(503).json({ message: "bade id request" });
  }
});

router.get("/", getProducts);
router.get("/:id", getProduct);
router.post("/", addProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

module.exports = router;
