const db = require("../db/connection");

const fetchTopics = () => {
  return db.query("SELECT * FROM topics").then((result) => {
    return result.rows;
  });
};

const insertTopic = (slug, description) => {
  if (description === undefined) {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  }
  return db
    .query(
      `INSERT INTO topics (slug, description) VALUES ($1, $2) RETURNING *`,
      [slug, description]
    )
    .then((result) => {
      return result.rows[0];
    });
};

module.exports = { fetchTopics, insertTopic };
