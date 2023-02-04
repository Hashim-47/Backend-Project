const { fetchUsers, fetchUser } = require("../models/users.model");

const getUsers = (req, res, next) => {
  fetchUsers()
    .then((users) => {
      res.status(200).send({ users: users });
    })
    .catch((err) => {
      next(err);
    });
};

const getUser = (req, res, next) => {
  const username = req.params.username;
  fetchUser(username)
    .then((user) => {
      res.status(200).send({ user: user });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = { getUsers, getUser };
