const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
// DB Config
const db = require("./config").MONGOURI;

// Connect to MongoDB
mongoose
  .connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));
// Express body parser
app.use(express.static("public"));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cors());
//Routes

app.use("/api/v1/product", require("./api/products/index.js"));
app.use("/api/v1/order", require("./api/orders/index.js"));
app.use("/user", require("./api/login"));

const PORT = process.env.PORT || 7000;

app.listen(PORT, console.log(`Server running on  ${PORT}`));
