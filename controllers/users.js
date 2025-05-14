const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const { JWT_SECRET } = require("../utils/config");
const { UnAuthorized } = require("../utils/unAuthorized");
const BadRequestError = require("../utils/badRequest");
const NotFoundError = require("../utils/notFoundError");
const DeFaultError = require("../utils/default");
const CreatedError = require("../utils/createdError");
const ConflictError = require("../utils/conflict");

const updateUsers = (req, res, next) => {
  const userId = req.user._id;
  const { name, avatar } = req.body;

  return User.findByIdAndUpdate(
    userId,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .then((users) => res.json(users))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return next(new BadRequestError("Invalid data provided"));
      }
      return next(new DeFaultError("Error message from userGetUser"));
    });
};

const createUser = (req, res, next) => {
  const { name, avatar, email, password } = req.body;

  if (!email || !name || !password) {
    return next(new BadRequestError("Missing required fields"));
  }

  return User.findOne({ email })
    .select("+password")
    .then((user) => {
      if (user) {
        throw new ConflictError("Email already in use");
      }
      return bcrypt.hash(password, 10);
    })
    .then((hashedPassword) =>
      User.create({ name, avatar, email, password: hashedPassword })
    )
    .then((user) => {
      const userData = {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      };
      return next(new CreatedError(userData));
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return next(new BadRequestError("Error from createUser"));
      }
      return next(err);
    });
};

const getCurrentUser = (req, res, next) => {
  const { _id } = req.user;

  return User.findById(_id)
    .orFail()
    .then((user) => res.json(user))
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        return next(new NotFoundError("User not found"));
      }
      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid user ID"));
      }
      return next(new DeFaultError("An error has occurred on the server"));
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new BadRequestError("Email and password are required"));
  }

  return User.findUserByCredentials({ email, password })
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.send({ token });
    })
    .catch((err) => {
      if (err.message === "Incorrect username or password") {
        return next(new UnAuthorized("Incorrect username or password"));
      }
      return next(new DeFaultError("Internal server error"));
    });
};

module.exports = { updateUsers, createUser, getCurrentUser, login };
