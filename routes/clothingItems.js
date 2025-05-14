const router = require("express").Router();
const { validateCardBody, validateId } = require("../middlewares/validation");
const authMiddleware = require("../middlewares/auth");

const {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItems");

// Read

router.get("/", getItems);

router.use("/", authMiddleware);
// Create
router.post("/", validateCardBody, createItem);

// DELETE

router.delete("/:itemId", validateId, deleteItem);

// LikeItem

router.put("/:itemId/likes", validateId, likeItem);

// Delete;
router.delete("/:itemId/likes", validateId, dislikeItem);

module.exports = router;
