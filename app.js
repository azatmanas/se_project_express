const express = require("express");
const app = express();
const mongoose = require("mongoose");
const mainRouter = require("./routes/index");
const e = require("express");

const { PORT = 3001 } = process.env;

mongoose.connect("mongodb://127.0.0.1:27017/wtwr_db");

app.use(express.json());

app.use("/", mainRouter);

app.listen(PORT, () => {
  console.log(`Server running is ${PORT}`);
});
