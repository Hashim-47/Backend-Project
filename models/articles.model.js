const db = require("../db/connection");

const fetchArticles = (topic, sort_by = "created_at", order = "desc") => {
  const validSortBy = ["title", "topic", "author", "body", "created_at"];
  const validOrder = ["DESC", "ASC", "desc", "asc"];

  if (!validSortBy.includes(sort_by)) {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  }

  if (!validOrder.includes(order)) {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  }

  let queryString = `SELECT articles.*, COUNT(comments.article_id) as comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id`;

  const queryParams = [];
  let checkTopicExists = "";

  if (topic) {
    queryString += ` WHERE articles.topic = $1`;
    queryParams.push(topic);
    checkTopicExists += `SELECT * FROM topics WHERE topics.slug = $1`;
  }

  queryString += ` GROUP BY articles.article_id ORDER BY articles.${sort_by} ${order}`;

  return Promise.all([
    db.query(queryString, queryParams),
    db.query(checkTopicExists, queryParams),
  ]).then((result) => {
    if (result[1].rows.length === 0 && topic !== undefined) {
      return Promise.reject({ status: 404, msg: "Not Found" });
    }

    return result[0].rows;
  });
};

const fetchArticle = (article_id) => {
  return db
    .query(
      "SELECT articles.*, COUNT(comments.article_id) as comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id WHERE articles.article_id = $1 GROUP BY articles.article_id",
      [article_id]
    )
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Not Found" });
      }
      return result.rows[0];
    });
};

const fetchArticleComments = (article_id) => {
  return fetchArticle(article_id).then((result) => {
    if (result) {
      return db
        .query(
          `SELECT * FROM comments WHERE article_id = $1 ORDER BY comments.created_at DESC`,
          [article_id]
        )
        .then((result) => {
          return result.rows;
        });
    }
  });
};

const insertComment = (article_id, username, body) => {
  if (body === undefined) {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  }
  return fetchArticle(article_id).then(() => {
    return db
      .query(
        `INSERT INTO comments (article_id, author, body) VALUES ($1, $2, $3) RETURNING *`,
        [article_id, username, body]
      )
      .then((result) => {
        return result.rows[0];
      });
  });
};

const fetchUserByUsername = (username) => {
  return db
    .query(`SELECT * FROM users WHERE username = $1`, [username])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Not Found" });
      }
      return rows;
    });
};

const updateArticle = (articleId, articleBody) => {
  return db
    .query(
      `
  UPDATE articles SET votes = votes + $2 WHERE article_id = $1 RETURNING*`,
      [articleId, articleBody]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Not Found" });
      }
      return rows[0];
    });
};

module.exports = {
  fetchArticles,
  fetchArticle,
  fetchArticleComments,
  insertComment,
  fetchUserByUsername,
  updateArticle,
};
