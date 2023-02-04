const express = require("express");
const {
  getArticle,
  getArticleComments,
  postComment,
  patchArticle,
  deleteArticle,
} = require("../controllers/articles.controller");

const articleRouter = express.Router();

articleRouter.get("/:article_id", getArticle);
articleRouter.get("/:article_id/comments", getArticleComments);
articleRouter.post("/:article_id/comments", postComment);
articleRouter.patch("/:article_id", patchArticle);
articleRouter.delete("/:article_id", deleteArticle);

module.exports = articleRouter;
