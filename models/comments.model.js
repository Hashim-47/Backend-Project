const db = require("../db/connection");

const deleteCommentById = (comment_id) => {
  return db
    .query("DELETE FROM comments WHERE comment_id = $1 RETURNING * ", [
      comment_id,
    ])
    .then((res) => {
      if (res.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Not Found" });
      }
    });
};

const patchCommentById = (comment_id, inc_votes) => {
  return db
    .query(
      "UPDATE comments SET votes = votes + $1 WHERE comment_id = $2 RETURNING * ",
      [inc_votes, comment_id]
    )
    .then((res) => {
      if (res.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Not Found" });
      }
      return res.rows[0];
    });
};

module.exports = { deleteCommentById, patchCommentById };
