require("dotenv").config();
const express = require("express");

const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const mainRouter = require("./routes/index");

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

app.use(errors());

app.listen(PORT, () => {
  console.log(`Server running is ${PORT}`);
});
app.use((err, req, res, next) => {
  console.error(err.stack);

  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message: statusCode === 500 ? "An error occurred on the server" : message,
  });
});
