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

module.exports = { deleteCommentById };
