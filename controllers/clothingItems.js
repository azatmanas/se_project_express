const ClothingItem = require("../models/clothingItem");

const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  ClothingItem.create({ name, weather, imageUrl })
    .then((item) => res.send({ data: item }))
    .catch(() => res.status(500).send({ message: "Error" }));
};

const getItems = (req, res) => {
  ClothingItem.find({});
};

module.exports = {
  createItem,
};
