const db = require("../db/connection");

const deleteCommentById = (comment_id) => {
  return db
    .query("DELETE FROM comments WHERE comment_id = $1 RETURNING * ", [
      comment_id,
    ])
    .then((res) => {
      if (res.rows.length === 0) {
        console.log(res.rows);
        return Promise.reject({ status: 404, msg: "Not Found" });
      }
    });
};

module.exports = { deleteCommentById };
