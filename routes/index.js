const mainRouter = require("express").Router();
const usersRouter = require("./users");
const clothingItemRouter = require("./clothingItems");

mainRouter.use("/users", usersRouter);
mainRouter.use("item", clothingItemRouter);

module.exports = mainRouter;
