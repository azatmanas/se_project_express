const mainRouter = require("express").Router();
const usersRouter = require("./users");
const clothingItemRouter = require("./clothingItems");
const { NOT_FOUND } = require("../utils/errors");

mainRouter.use("/users", usersRouter);
mainRouter.use("/items", clothingItemRouter);
app.post("/signin", login);
app.post("/signup", createUser);
mainRouter.use((req, res) => {
  res.status(NOT_FOUND).send({ message: "Requested resource not found" });
});

module.exports = mainRouter;
