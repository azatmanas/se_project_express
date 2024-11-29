const mainRouter = require("express").Router();
const usersRouter = require("./users");
const clothingItemRouter = require("./clothingItems");
const { NOT_FOUND } = require("../utils/errors");

mainRouter.use("/users", usersRouter);
mainRouter.use("/item", clothingItemRouter);

mainRouter.use((req, res) => {
  res.status(NOT_FOUND).send({ message: "Requested resource not found" });
});

module.exports = mainRouter;
