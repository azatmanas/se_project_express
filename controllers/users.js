const User = require("../models/user");
const { BAD_REQUEST, NOT_FOUND, DEFAULT } = require("../utils/errors");

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() => res.status(DEFAULT).send({ message: "Error" }));
};

const createUser = (req, res) => {
  const { name, avatar } = req.body;
  User.create({ name, avatar })
    .then((user) => {
      res.send(user);
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
  const { _userId } = req.params;
  User.findById(_userId)
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === "DocumentFoundError") {
        res.status(BAD_REQUEST).send({ message: "Error from getUser" });
      } else {
        res.status(NOT_FOUND).send({ message: "Error from getUser" });
      }
    });

  // .catch((err) => {
  //   if (err.name === "DocumentFoundError") {
  //     res.status(NOT_FOUND);
  //   } else {
  //     if (err.name === "CastError") {
  //       res.status(401);
  //     }
  //     return res.status(DEFAULT).send({ message: "Error" });
  //   }
  // });
};

module.exports = { getUsers, createUser, getUser };
