const router = require("express").Router();
const { login, createUser } = require("../controllers/users");
const { authMiddleware } = require("../middlewares/auth");

router.post("/signin", login);
router.post("/signup", createUser);

router.use(authMiddleware);
module.exports = router;
