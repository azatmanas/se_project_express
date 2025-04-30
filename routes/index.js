const mainRouter = require("express").Router();
const usersRouter = require("./users");
const clothingItemRouter = require("./clothingItems");

const { login, createUser } = require("../controllers/users");
const NotFoundError = require("../utils/notFoundError");

mainRouter.post("/signin", login);
mainRouter.post("/signup", createUser);
mainRouter.use("/users", usersRouter);
mainRouter.use("/items", clothingItemRouter);
mainRouter.use((res) => {
  res.status(NotFoundError).send({ message: "Requested resource not found" });
});

module.exports = mainRouter;
