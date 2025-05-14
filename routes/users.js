const router = require("express").Router();
const { updateUsers, getCurrentUser } = require("../controllers/users");
const authMiddleware = require("../middlewares/auth");
const { validateUserUpdate } = require("../middlewares/validation");

router.use(authMiddleware);
router.get("/me", getCurrentUser);
router.patch("/me", validateUserUpdate, updateUsers);

module.exports = router;
