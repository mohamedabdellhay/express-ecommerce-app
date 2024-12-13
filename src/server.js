const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const productRoutes = require("./routes/productRoutes");
const app = express();
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.send("Start dev....");
});

app.post("/user/sign", (req, res) => {
  console.log("listening to sign in page");
  console.log(req.body);
  res.send("sign in peg api");
});

app.get("test", (req, res) => {
  console.log("start test page");
  res.send("test start");
});
app.use(cors());
app.use(bodyParser.json());

app.use("/api/products", productRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
