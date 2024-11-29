const router = require("express").Router();

const {
  createItem,
  getItems,
  updateItem,
  deleteItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItems");

// Create
router.post("/", createItem);

// Read

router.get("/", getItems);

// Update
router.put("/:itemId", updateItem);

// DELETE

router.delete("/:itemId", deleteItem);

// LikeItem

router.put("/:itemId", likeItem);

// Delete;
router.delete("/:itemId", dislikeItem);

module.exports = router;
