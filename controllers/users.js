const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const { JWT_SECRET } = require("../utils/config");
const { BAD_REQUEST, NOT_FOUND, DEFAULT } = require("../utils/errors");

const updateUsers = (req, res) => {
  const userId = req.user._id;
  const { name, avatar } = req.body;
  User.findByIdAndUpdate(
    userId,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .then((users) => res.status(200).send(users))
    .catch((err) => {
      if (err.name === "Validation Error") {
        return res.status(NOT_FOUND).send({ message: "Invalid data provided" });
      }
      return res
        .status(DEFAULT)
        .send({ message: "Error message from userGetUser" });
    });
};

const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;
  User.findOne({ email })
    .select("+password")
    .then((user) => {
      if (user) {
        throw new Error({ message: "Email already in use" });
      }
      return bcrypt.hash(password, 10);
    });

  User.create({ name, avatar, email, password })
    .then((user) => {
      res.status(201).send(user);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res
          .status(BAD_REQUEST)
          .send({ message: "Error from createUser" });
      }
      if (err.code === 11000) {
        return res.status(NOT_FOUND).send({ message: "Duplicate email error" });
      }
      return res.status(DEFAULT).send({ message: "Error from createUser" });
    });
};

const getCurrentUser = (req, res) => {
  const { userId } = req.user;
  User.findById(userId)
    .orFail()
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND).send({ message: err.message });
      }
      if (err.name === "CastError") {
        return res.status(BAD_REQUEST).send({ message: err.message });
      }
      return res
        .status(DEFAULT)
        .send({ message: "An error has occurred on the server" });
    });
};
const login = (req, res) => {
  const { email, password } = req.body;
  User.findUserByCredentials({ email, password })
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.status(200).send({ token });
    })
    .catch(() => {
      res.status(401).send({ message: "Incorrect username or password" });
    });
};

module.exports = { updateUsers, createUser, getCurrentUser, login };
