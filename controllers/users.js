const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const { JWT_SECRET } = require("../utils/config");
const { UnAuthorized } = require("../utils/unAuthorized");

const { CREATED, CONFLICT } = require("../utils/errors");
const BadRequestError = require("../utils/badRequest");
const NotFoundError = require("../utils/notFoundError");
const DeFaultError = require("../utils/default");
const Ok = require("../utils/ok");

const updateUsers = (req, res) => {
  const userId = req.user._id;
  const { name, avatar } = req.body;
  User.findByIdAndUpdate(
    userId,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .then((users) => res.status(Ok).json(users))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res
          .status(BadRequestError)
          .json({ message: "Invalid data provided" });
      }

      return res
        .status(DeFaultError)
        .json({ message: "Error message from userGetUser" });
    });
};

const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;

  if (!email || !name || !password) {
    return res
      .status(BadRequestError)
      .send({ message: "Missing required fields" });
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
      res.status(CREATED).send({
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res
          .status(BadRequestError)
          .send({ message: "Error from createUser" });
      }
      if (err.code === 110000) {
        return res.status(CONFLICT).send({ message: "Email already in use" });
      }
      return res
        .status(DeFaultError)
        .send({ message: "Error from createUser" });
    });
};

const getCurrentUser = (req, res) => {
  const { _id } = req.user;
  User.findById(_id)
    .orFail()
    .then((user) => res.status(Ok).send(user))
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        return res.status(NotFoundError).send({ message: err.message });
      }
      if (err.name === "CastError") {
        return res.status(BadRequestError).send({ message: err.message });
      }
      return res
        .status(DeFaultError)
        .send({ message: "An error has occurred on the server" });
    });
};
const login = (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(BadRequestError)
      .send({ message: "Email and password are required" });
  }
  return User.findUserByCredentials({ email, password })
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      return res.status(Ok).send({ token });
    })
    .catch((err) => {
      if (err.message === "Incorrect username or password") {
        return res
          .status(UnAuthorized)
          .send({ message: "Incorrect username or password" });
      }
      return res
        .status(DeFaultError)
        .send({ message: "Internal server error" });
    });
};

module.exports = { updateUsers, createUser, getCurrentUser, login };
