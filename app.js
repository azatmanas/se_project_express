const express = require("express");

const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const mainRouter = require("./routes/index");
const validator = require("validator");
const { errors } = require("celebrate");
const {
  requestLogger,
  errorLogger,
  messageFormat,
} = require("./middlewares/logger");

const { PORT = 3001 } = process.env;

mongoose.connect("mongodb://127.0.0.1:27017/wtwr_db");

app.use(requestLogger);
app.use(cors());
app.use(express.json());
app.use(errorLogger);
app.use(messageFormat);
app.use("/", mainRouter);
app.use("/", validator);
app.use(errors());

app.listen(PORT, () => {
  console.log(`Server running is ${PORT}`);
});
