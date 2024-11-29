const User = require("./../models/user");

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((res) => res.status(500).send({ message: "Error" }));
};

const createUser = (req, res) => {
  const { name, avatar } = req.body;
  console.log(name);

  User.create({ name, avatar })
    .then((user) => {
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(400).send({ message: "Error from createUser" });
      } else {
        res.status(500).send({ message: "Error from createUser" });
      }
    });
};

const getUser = (req, res) => {
  const { _userId } = req.params;
  User.findById(_userId)
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === "DocumentFoundError") {
        res.status(404);
      } else {
        if (err.name === "CastError") {
          res.status(401);
        }
        return res.status(500).send({ message: "Error" });
      }
    });
};

module.exports = { getUsers, createUser, getUser };
