const express = require("express");
const { getTopics, postTopic } = require("../controllers/topics.controller");
const {
  getArticles,
  postArticle,
} = require("../controllers/articles.controller");
const { getUsers } = require("../controllers/users.controller");

const usersRouter = require("./users.router");
const articleRouter = require("./articles.router");
const commentsRouter = require("./comments.router");

const apiRouter = express.Router();
apiRouter.get("/topics", getTopics);
apiRouter.post("/topics", postTopic);
apiRouter.get("/users", getUsers);
apiRouter.use("/users", usersRouter);
apiRouter.get("/articles", getArticles);
apiRouter.post("/articles", postArticle);
apiRouter.use("/articles", articleRouter);
apiRouter.use("/comments", commentsRouter);

module.exports = apiRouter;
