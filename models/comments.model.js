const db = require("../db/connection");

function removeComment(id) {
  const query = `DELETE FROM comments WHERE comment_id = $1;`;
  return db.query(query, [id]).then(({ rowCount }) => {
    if (rowCount === 0) return Promise.reject({ status: 404, msg: "comment does not exist" });
  });
}

module.exports = { removeComment };
