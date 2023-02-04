const express = require("express");
const { getUser } = require("../controllers/users.controller");

const usersRouter = express.Router();
usersRouter.get("/:username", getUser);

module.exports = usersRouter;
