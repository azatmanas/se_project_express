const express = require("express");

const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const mainRouter = require("./routes/index");
const validator = require("validator");
const { errors } = require("celebrate");

const { PORT = 3001 } = process.env;

mongoose.connect("mongodb://127.0.0.1:27017/wtwr_db");

app.use(cors());
app.use(express.json());
app.use("/", mainRouter);
app.use("/", validator);
app.use(errors());

app.listen(PORT, () => {
  console.log(`Server running is ${PORT}`);
});
