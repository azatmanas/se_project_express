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
    type: String,
    required: true,
    select: false,
  },
});
userSchema.statics.findUserByCredentials = function ({ email, password }) {
  return this.findOne({ email })
    .select("+password") // Ensure password is included even if it's excluded by default
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error("Incorrect username or password"));
      }
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return Promise.reject(new Error("Incorrect username or password"));
        }
        return user;
      });
    });
};
module.exports = moongose.model("user", userSchema);
