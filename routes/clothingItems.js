const router = require("express").Router();

const {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItems");

// Create
router.post("/", createItem);

// Read

router.get("/", getItems);

// DELETE

router.delete("/:itemId", deleteItem);

// LikeItem

router.put("/:itemId/likes", likeItem);

// Delete;
router.delete("/:itemId/likes", dislikeItem);

module.exports = router;
