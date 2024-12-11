const mainRouter = require("express").Router();
const usersRouter = require("./users");
const clothingItemRouter = require("./clothingItems");
const { NOT_FOUND } = require("../utils/errors");
const { login, createUser } = require("../controllers/users");

mainRouter.post("/signin", login);
mainRouter.post("/signup", createUser);
mainRouter.use("/users", usersRouter);
mainRouter.use("/items", clothingItemRouter);
mainRouter.use((req, res) => {
  console.error(`Requested URL: ${req.url}`);
  res.status(NOT_FOUND).send({ message: "Requested resource not found" });
});

module.exports = mainRouter;
