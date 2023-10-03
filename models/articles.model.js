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

function selectArticles() {
  const query = `SELECT articles.article_id, articles.author, articles.title, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.comment_id)::int as comment_count
  FROM articles
  LEFT JOIN comments 
  ON articles.article_id = comments.article_id 
  GROUP BY articles.article_id 
  ORDER BY articles.created_at DESC;`;

  return db.query(query).then(({ rows }) => {
    return rows;
  });
}

function selectCommentsByArticleId(id) {
  return selectArticleById(id)
    .then(() => {
      const query = `SELECT * FROM comments 
      WHERE article_id=$1
      ORDER BY created_at DESC;`;
      return db.query(query, [id]);
    })
    .then(({ rows }) => {
      return rows;
    });
}

module.exports = { selectArticleById, selectArticles, selectCommentsByArticleId };
