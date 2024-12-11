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
    .then((users) => res.status(200).json(users))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(NOT_FOUND).json({ message: "Invalid data provided" });
      }

      return res
        .status(DEFAULT)
        .json({ message: "Error message from userGetUser" });
    });
};

const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;

  if (!email || !name || !password) {
    return res.status(BAD_REQUEST).send({ message: "Missing required fields" });
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
      res.status(201).send({
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res
          .status(BAD_REQUEST)
          .send({ message: "Error from createUser" });
      }
      if (err.code === 110000) {
        return res.status(409).send({ message: "Email already in use" });
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
  if (!email || !password) {
    return res
      .status(BAD_REQUEST)
      .send({ message: "Email and password are required" });
  }
  return User.findUserByCredentials({ email, password })
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.setHeader("Content-Type", "application/json");
      return res.status(200).send({ token });
    })
    .catch((err) => {
      if (err.name === "Incorrect username or password") {
        return res
          .status(401)
          .send({ message: "Incorrect username or password" });
      }
      return res.status(BAD_REQUEST).send({ message: "Internal server error" });
    });
};

module.exports = { updateUsers, createUser, getCurrentUser, login };
