const router = require("express").Router();
const { updateUsers, getCurrentUser } = require("../controllers/users");
const authMiddleware = require("../middlewares/auth");

router.use(authMiddleware);
router.get("/me", getCurrentUser);
router.patch("/me", updateUsers);

module.exports = router;
