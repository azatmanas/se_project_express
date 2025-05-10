const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const { JWT_SECRET } = require("../utils/config");
const { UnAuthorized } = require("../utils/unAuthorized");
const BadRequestError = require("../utils/badRequest");
const NotFoundError = require("../utils/notFoundError");
const DeFaultError = require("../utils/default");
const CreatedError = require("../utils/created");
const ConflictError = require("../utils/conflict");

const updateUsers = (req) => {
  const userId = req.user._id;
  const { name, avatar } = req.body;
  User.findByIdAndUpdate(
    userId,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .then((users) => next(new OK()).json(users))
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new BadRequestError("Invalid data provided"));
      }

      next(new DeFaultError("Error message from userGetUser"));
    });
  return next(err);
};

const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;

  if (!email || !name || !password) {
    next(new BadRequestError("Missing required fields"));
  }
  return User.findOne({ email })
    .select("+password")
    .then((user) => {
      if (user) {
        const error = new Error();
        error.code = 110000;
        throw error;
      }

      return bcrypt
        .hash(password, 10)
        .then((hashedPassword) =>
          User.create({ name, avatar, email, password: hashedPassword })
        );
    })
    .then((user) => {
      next(new CreatedError()).send({
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new BadRequestError("Error from createUser"));
      }
      if (err.code === 110000) {
        next(new ConflictError("Email already in use"));
      }

      next(new DeFaultError("Error from createUser"));
    });
};

const getCurrentUser = (req, res) => {
  const { _id } = req.user;
  User.findById(_id)
    .orFail()
    .then((user) => next(new OK()).send(user))
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        next(new NotFoundError("message: err.message "));
      }
      if (err.name === "CastError") {
        next(new BadRequestError("Invalid cast error"));
      }

      next(new DeFaultError("An error has occurred on the server"));
    });
};
const login = (req) => {
  const { email, password } = req.body;
  if (!email || !password) {
    next(new BadRequestError("Email and password are required"));
  }
  return User.findUserByCredentials({ email, password })
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      next(new OK()).send({ token });
    })
    .catch((err) => {
      if (err.message === "Incorrect username or password") {
        next(new UnAuthorized("Incorrect username or password"));
      }

      next(new DeFaultError("Internal server error"));
    });
};

module.exports = { updateUsers, createUser, getCurrentUser, login };
