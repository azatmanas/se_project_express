const moongose = require("mongoose");
const validator = require("validator");

const clothingItem = moongose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 30,
  },
  weather: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
    validate: {
      validator: (v) => validator.isURL(v),
      message: "Link is not Valid",
    },
    owner: {
      type: String,
      required: true,
    },
    likes: {
      type: String,
      required: true,
    },
    createdAt: {
      type: String,
      required: true,
    },
  },
});

module.exports = moongose.model("clothingItems", clothingItem);
