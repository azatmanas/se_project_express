const mainRouter = require("express").Router();
const usersRouter = require("./users");
const clothingItemRouter = require("./clothingItems");

const { login, createUser } = require("../controllers/users");
const NotFoundError = require("../utils/notFoundError");

app.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("Server will crash now");
  }, 0);
});

mainRouter.post("/signin", login);
mainRouter.post("/signup", createUser);
mainRouter.use("/users", usersRouter);
mainRouter.use("/items", clothingItemRouter);
router.use((req, res, next) => {
  next(new NotFoundError("Page is not found"));
});

module.exports = mainRouter;
