const ClothingItem = require("../models/clothingItem");
const { BAD_REQUEST, NOT_FOUND, DEFAULT } = require("../utils/errors");

const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  ClothingItem.create({ name, weather, imageUrl })
    .then((item) => res.status(201).send({ item }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(BAD_REQUEST).send({ message: "Error from createItem" });
      } else {
        res.status(DEFAULT).send({ message: "Error from createItem" });
      }
    });
};

const getItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.status(200).send(items))
    .catch((err) => {
      console.error(err);
      res.status(DEFAULT).send({ message: "Error from getItems" });
    });
};

const updateItem = (req, res) => {
  const { itemId } = req.params;
  const { imageUrl } = req.body;
  ClothingItem.findByIdAndUpdate(itemId, { $set: { imageUrl } })
    .orFail()
    .then((item) => res.status(200).send({ data: item }))
    .catch((err) => {
      if (err.name === "DocumentFoundError") {
        res.status(BAD_REQUEST).send({ message: "Error from updateItem" });
      } else {
        res.status(NOT_FOUND).send({ message: "Error from updateItem" });
      }
    });
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;

  ClothingItem.findByIdAndDelete(itemId)
    .orFail()
    .then(() => res.status(200).send({ message: "Item Deleted" }))
    .catch((err) => {
      if (err.name === "DocumentFoundError") {
        res.status(BAD_REQUEST);
      } else {
        if (err.name === "CastError") {
          res.status(BAD_REQUEST);
        }
        return res
          .status(BAD_REQUEST)
          .send({ message: "Error from deleteItem" });
      }
    });
};

const likeItem = (req, res) =>
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail(() => res.status(BAD_REQUEST))
    .then((item) => res.status(BAD_REQUEST).send(item))
    .catch((err) => {
      console.error(err);
      res.status(NOT_FOUND).send({ message: "Error from LikeItem" });
    });

const dislikeItem = (req, res) =>
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail(() => res.status(NOT_FOUND))
    .then((item) => res.status(200).send(item))
    .catch((err) => {
      console.error(err);

      res
        .status(BAD_REQUEST)
        .send({ message: "Error message from disLikeItem" });
    });

module.exports = {
  createItem,
  getItems,
  updateItem,
  deleteItem,
  likeItem,
  dislikeItem,
};
