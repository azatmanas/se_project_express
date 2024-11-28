const moongose = require("mongoose");
const validator = require("validator");

const clothingItem = moongose.Schema({
  name: {
    type: String,
    required: true,
  },
  weather: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
    validate: {
      validator: (v) => validator.imageUrl(v),
      message: "Link is not Valid",
    },
  },
});

module.exports = moongose.model("clothingItems", clothingItem);
