const mongoose = require("mongoose");
const ClothingItem = require("../models/clothingItem");
const BadRequestError = require("../utils/badRequest");
const NotFoundError = require("../utils/notFoundError");
const DeFaultError = require("../utils/default");
const ForBiddenError = require("../utils/forbidden");

const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;
  ClothingItem.create({ name, weather, imageUrl, owner })
    .then((item) => res.status(CreatedError).send(item))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res
          .status(BadRequestError)
          .send({ message: "Error from create Val" });
      }
      return res
        .status(DeFaultError)
        .send({ message: "Error from createItem" });
    });
};

const getItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.status(Ok).send(items))
    .catch(() => {
      res.status(DeFaultError).send({ message: "Error from getItems" });
    });
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;
  ClothingItem.findById(itemId)
    .orFail()
    .then((item) => {
      const ownerId = item.owner.toString();
      if (ownerId !== req.user._id) {
        throw new Error("Forbidden");
      }
      return ClothingItem.findByIdAndDelete(itemId);
    })

    .then(() => res.status(Ok).send({ message: "Item deleted" })) // keep inside then block the response in case everything is successful / correct
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        return res.status(NotFoundError).send({ message: "Item not found" });
      }
      if (err.message === "Forbidden") {
        return res
          .status(ForBiddenError)
          .send({ message: "You are not authorized to delete this item" });
      }

      if (err.name === "CastError") {
        return res
          .status(BadRequestError)
          .send({ message: "Invalid ID format" });
      }
      return res
        .status(DeFaultError)
        .send({ message: "Server error occurred" });
    });
};

const likeItem = (req, res) => {
  const { itemId } = req.params;
  const userId = req.user._id;

  ClothingItem.findByIdAndUpdate(
    itemId,
    { $addToSet: { likes: userId } },
    { new: true }
  )
    .orFail()
    .then((item) => res.status(Ok).send({ data: item }))
    .catch((err) => {
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        return res.status(NotFoundError).send({ message: "Invalid ID format" });
      }
      if (err.name === "CastError") {
        return res
          .status(BadRequestError)
          .send({ message: "Invalid ID format" });
      }
      return res.status(DeFaultError).send({ message: "Error from LikeItem" });
    });
};

const dislikeItem = (req, res) => {
  const userId = req.user._id;
  const { itemId } = req.params;
  ClothingItem.findByIdAndUpdate(
    itemId,
    { $pull: { likes: userId } },
    { new: true }
  )
    .orFail()
    .then((item) => res.status(Ok).send({ data: item }))
    .catch((err) => {
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        return res.status(NotFoundError).send({ message: "Item not found" });
      }
      if (err.name === "CastError") {
        return res
          .status(BadRequestError)
          .send({ message: "Invalid item ID format" });
      }
      return res
        .status(DeFaultError)
        .send({ message: "Server error occurred" });
    });
};

module.exports = {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  dislikeItem,
};
