const db = require("../db/connection");

const fetchArticles = (
  topic,
  sort_by = "created_at",
  order = "desc",
  p = 1,
  limit = 10
) => {
  const validSortBy = ["title", "topic", "author", "body", "created_at", "votes", "comment_count"];
  const validOrder = ["DESC", "ASC", "desc", "asc"];
  if (isNaN(+p) || isNaN(+limit)) {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  }
  const startPage = (p - 1) * limit;
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
  queryString += ` GROUP BY articles.article_id ORDER BY`
  if(sort_by === "comment_count"){
    queryString += ` ${sort_by}`
  } else {
    queryString += ` articles.${sort_by}`
  }
  
  queryString += ` ${order} LIMIT ${limit} OFFSET ${startPage}`;

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

const fetchArticleComments = (article_id, p = 1, limit = 10) => {
  if (isNaN(+p) || isNaN(+limit)) {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  }
  const startPage = (p - 1) * 10;
  return fetchArticle(article_id).then((result) => {
    if (result) {
      return db
        .query(
          `SELECT * FROM comments WHERE article_id = $1 ORDER BY comments.created_at DESC LIMIT ${limit} OFFSET ${startPage}`,
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

const insertArticle = (author, body, title, topic, article_img_url) => {
  if (body === undefined || title === undefined || topic === undefined) {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  }

  let queryStringStart = `INSERT INTO articles (author, body, title, topic`;
  let queryStringEnd = "";

  const queryArr = [author, body, title, topic];

  if (article_img_url !== undefined) {
    queryStringStart += ", article_img_url";
    queryStringEnd += ", $5";
    queryArr.push(article_img_url);
  }

  queryStringStart +=
    ") VALUES ($1, $2, $3, $4" + queryStringEnd + ") RETURNING *";

  return db.query(queryStringStart, queryArr).then((result) => {
    return result.rows[0].article_id;
  });
};

const deleteArticleById = (article_id) => {
  return db
    .query("DELETE FROM comments WHERE article_id = $1", [article_id])
    .then(() => {
      return db.query(
        "DELETE FROM articles WHERE article_id = $1 RETURNING * ",
        [article_id]
      );
    })
    .then((res) => {
      if (res.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Not Found" });
      }
    });
};

module.exports = {
  fetchArticles,
  fetchArticle,
  fetchArticleComments,
  insertComment,
  fetchUserByUsername,
  updateArticle,
  insertArticle,
  deleteArticleById,
};
