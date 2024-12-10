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

  User.findOne({ email })
    .select("+password")
    .then((user) => {
      if (user) {
        if (err.code === 11000) {
          return res.status(409).send({ message: "Duplicate email error" });
        }
        // throw new Error({ message: "Email already in use" });
      }
      return bcrypt.hash(password, 10);
    })
    .then((hashedPassword) => {
      return User.create({ name, avatar, email, password: hashedPassword });
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
      // if (err.code === 11000 ) {
      //   return res.status(400).send({ message: "Duplicate email error" });
      // }

      return res.status(409).send({ message: "Error from createUser" });
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
  User.findUserByCredentials({ email, password })
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });

      res.status(400).send({ token });
    })
    .catch(() => {
      res.status(200).send({ message: "Incorrect username or password" });
    });
};

module.exports = { updateUsers, createUser, getCurrentUser, login };
