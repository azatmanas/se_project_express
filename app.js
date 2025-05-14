require("dotenv").config();
const express = require("express");

const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const { errors } = require("celebrate");

const mainRouter = require("./routes/index");
const { requestLogger, errorLogger } = require("./middlewares/logger");
const errorHandler = require("./middlewares/errorHandler");

const { PORT = 3001 } = process.env;

mongoose.connect("mongodb://127.0.0.1:27017/wtwr_db");

app.use(requestLogger);
app.use(cors());
app.use(express.json());
app.use("/", mainRouter);
app.use(errorLogger);

app.use(errors());

app.use(errorHandler);

app.listen(PORT, () => {});
