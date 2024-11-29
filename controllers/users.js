const User = require("../models/user");
const { BAD_REQUEST, NOT_FOUND, DEFAULT } = require("../utils/errors");

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch(() => {
      res.status(DEFAULT).send({ message: "Error message from userGetUser" });
    });
};

const createUser = (req, res) => {
  const { name, avatar } = req.body;
  User.create({ name, avatar })
    .then((user) => {
      res.status(201).send(user);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(BAD_REQUEST).send({ message: "Error from createUser" });
      } else {
        res.status(DEFAULT).send({ message: "Error from createUser" });
      }
    });
};

const getUser = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === "DocumentFoundError") {
        res.status(NOT_FOUND).send({ message: "document didnt found" });
      } else {
        if (err.name === "CastError") {
          res.status(DEFAULT);
        }
        return res.status(BAD_REQUEST).send({ message: "Error from getUser" });
      }
    });
};

module.exports = { getUsers, createUser, getUser };
