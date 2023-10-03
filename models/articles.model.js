const db = require("../db/connection");

function selectArticleById(id) {
  const query = `SELECT * FROM articles WHERE article_id=$1`;
  return db.query(query, [id]).then(({ rows }) => {
    if (!rows[0]) {
      return Promise.reject({ status: 404, msg: "article does not exist" });
    }
    return rows[0];
  });
}
module.exports = { selectArticleById };
