const express = require("express");

const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const mainRouter = require("./routes/index");

const { PORT = 3001 } = process.env;

mongoose.connect("mongodb://127.0.0.1:27017/wtwr_db");

app.use((req, res, next) => {
  req.user = {
    _id: "5d8b8592978f8bd833ca8133",
  };
  next();
});

app.use(cors());
app.use(express.json());
app.use("/", mainRouter);

app.listen(PORT, () => {
  console.log(`Server running is ${PORT}`);
});
