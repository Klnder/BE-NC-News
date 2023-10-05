const db = require("../db/connection");

function removeComment(id) {
  const query = `DELETE FROM comments WHERE comment_id = $1;`;
  return db.query(query, [id]).then(({ rowCount }) => {
    if (rowCount === 0) return Promise.reject({ status: 404, msg: "comment does not exist" });
  });
}

function updateComment(id, { inc_votes }) {
  return selectCommentById(id)
    .then(({ votes }) => {
      const newVotes = votes + Number(inc_votes);
      const query = `UPDATE comments SET votes=$1
    WHERE comment_id=$2 RETURNING *;`;
      return db.query(query, [newVotes, id]);
    })
    .then(({ rows }) => {
      return rows[0];
    });
}

function selectCommentById(id) {
  const query = `SELECT * FROM comments WHERE comment_id=$1`;
  return db.query(query, [id]).then(({ rows }) => {
    if (!rows[0]) return Promise.reject({ status: 404, msg: "comment does not exist" });
    return rows[0];
  });
}

module.exports = { removeComment, updateComment };
