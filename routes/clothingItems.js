const router = require("express").Router();
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
router.post("/", createItem);

// DELETE

router.delete("/:itemId", deleteItem);

// LikeItem

router.put("/:itemId/likes", likeItem);

// Delete;
router.delete("/:itemId/likes", dislikeItem);

module.exports = router;
