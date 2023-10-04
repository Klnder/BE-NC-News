const db = require("../db/connection");

function selectArticleById(id) {
  return selectArticles(id).then((article) => {
    if (!article[0]) {
      return Promise.reject({ status: 404, msg: "article does not exist" });
    }
    return article[0];
  });
}

function selectArticles(id) {
  const values = [];

  let query = `SELECT articles.article_id, articles.author, articles.title, articles.topic, articles.created_at, articles.votes, articles.article_img_url,`;

  if (id) {
    query += `articles.body, `;
  }
  query += `COUNT(comments.comment_id)::int as comment_count
  FROM articles
  LEFT JOIN comments 
  ON articles.article_id = comments.article_id `;

  if (id) {
    query += `WHERE articles.article_id=$1 `;
    values.push(id);
  }

  query += `GROUP BY articles.article_id 
  ORDER BY articles.created_at DESC;`;

  return db.query(query, values).then(({ rows }) => {
    return rows;
  });
}

function insertCommentByArticleId(id, { username, body }) {
  //try with promise.allsettled
  //couldn't retrieve different errors as already set
  //need to look back at it if got time

  //without promise.allsettled work as expected :)
  return selectArticleById(id)
    .then(() => {
      return checkUsernameExist(username);
    })
    .then(() => {
      const query = `INSERT INTO comments (article_id, author, body) VALUES ($1, $2, $3) RETURNING *;`;
      return db.query(query, [id, username, body]).then(({ rows }) => {
        return rows[0];
      });
    })
    .catch((err) => {
      return Promise.reject(err);
    });
}

function checkUsernameExist(username) {
  const query = `SELECT * FROM users WHERE username=$1;`;
  return db.query(query, [username]).then(({ rows }) => {
    if (!rows[0]) {
      return Promise.reject({ status: 404, msg: "username does not exist" });
    } else {
      return rows[0];
    }
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

function updateArticle(id, { inc_votes }) {
  return selectArticleById(id)
    .then(({ votes }) => {
      const newVotes = votes + Number(inc_votes);
      const query = `UPDATE articles SET votes=$1 WHERE article_id=$2 RETURNING *;`;
      return db.query(query, [newVotes, id]);
    })
    .then(({ rows }) => {
      return rows[0];
    });
}

module.exports = { selectArticleById, selectArticles, insertCommentByArticleId, selectCommentsByArticleId, updateArticle };
