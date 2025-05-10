const router = require("express").Router();
const { updateUsers, getCurrentUser } = require("../controllers/users");
const authMiddleware = require("../middlewares/auth");
const { validateCardBody } = require("../middlewares/validation");
router.use(authMiddleware);
router.get("/me", getCurrentUser);
router.patch("/me", updateUsers, validateCardBody);

module.exports = router;
