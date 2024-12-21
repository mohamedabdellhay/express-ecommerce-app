require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const path = require("path");
const cron = require("node-cron");
//end redis
const productRoutes = require("./routes/v1/productRoutes");
const categoryRoutes = require("./routes/v1/categoryRoutes.js");
const pool = require("./config/db.js");

cron.schedule("* * * * *", async () => {
  try {
    console.log("Updating top products...");

    const query = `SELECT * FROM "products" WHERE "sales_count" != '0' ORDER BY "sales_count" DESC LIMIT 50`;
    const { rows: topProducts } = await pool.query(query);

    await pool.query("DELETE FROM top_products");
    for (const product of topProducts) {
      await pool.query(
        "INSERT INTO top_products (product_id, sales_count) VALUES ($1, $2)",
        [product.id, product.sales_count]
      );
    }

    console.log("Top products updated successfully.");
  } catch (error) {
    console.error("Error updating top products:", error);
  }
});

app.use(cors());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.all("*", (req, res, next) => {
  console.log(req.body);
  next();
});
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "main.html"));
});
app.get("/docs", (req, res) => {
  res.send("docs");
});
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/categories", categoryRoutes);

const PORT = process.env.APP_PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
