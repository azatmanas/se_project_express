const moongose = require("mongoose");
const validator = require("validator");

const userSchema = new moongose.Schema({
  name: { type: String, required: true, minlength: 2, maxlength: 30 },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(value) {
        return validator.isEmail(value);
      },
    },
  },
  avatar: {
    type: String,
    required: true,
    validate: {
      validator(value) {
        return validator.isURL(value);
      },
      message: "You must enter a valid URL",
    },
  },
  password: {
    required: true,
    type: String,
    select: false,
  },
});
module.exports = moongose.model("user", userSchema);
