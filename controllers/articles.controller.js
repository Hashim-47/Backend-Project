const {
  fetchArticles,
  fetchArticle,
  fetchArticleComments,
  insertComment,
  fetchUserByUsername,
  updateArticle,
  insertArticle,
  deleteArticleById,
} = require("../models/articles.model");

const getArticles = (req, res, next) => {
  const topic = req.query.topic;
  const sort_by = req.query.sort_by;
  const order = req.query.order;
  const p = req.query.p;
  const limit = req.query.limit;

  fetchArticles(topic, sort_by, order, p, limit)
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch((err) => {
      next(err);
    });
};

const getArticle = (req, res, next) => {
  const { article_id } = req.params;
  fetchArticle(article_id)
    .then((article) => {
      res.status(200).send({ article: article });
    })
    .catch((err) => {
      next(err);
    });
};

const getArticleComments = (req, res, next) => {
  const { article_id } = req.params;
  const p = req.query.p;
  const limit = req.query.limit;
  fetchArticleComments(article_id, p, limit)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};

const postComment = (req, res, next) => {
  const { article_id } = req.params;
  const { username, body } = req.body;

  return fetchUserByUsername(username)
    .then(() => {
      return insertComment(article_id, username, body);
    })
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
};

const patchArticle = (req, res, next) => {
  const articleId = req.params.article_id;
  const articleBody = req.body.inc_votes;
  return fetchArticle(articleId)
    .then((exists) => {
      if (exists) {
        return updateArticle(articleId, articleBody);
      }
    })
    .then((result) => {
      return res.status(200).send({ result });
    })
    .catch((err) => {
      next(err);
    });
};

const postArticle = (req, res, next) => {
  const { author, body, title, topic, article_img_url } = req.body;

  return fetchUserByUsername(author)
    .then(() => {
      return insertArticle(author, body, title, topic, article_img_url);
    })
    .then((article_id) => {
      return fetchArticle(article_id);
    })
    .then((article) => {
      res.status(201).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

const deleteArticle = (req, res, next) => {
  const { article_id } = req.params;

  deleteArticleById(article_id)
    .then(() => {
      res.sendStatus(204);
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = {
  getArticles,
  getArticle,
  getArticleComments,
  postComment,
  patchArticle,
  postArticle,
  deleteArticle,
};
