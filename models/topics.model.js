const db = require("../db/connection");

function fetchTopics() {
  const query = `SELECT * FROM topics;`;
  return db.query(query).then(({ rows }) => {
    return rows;
  });
}

function insertTopic(topic) {
  const { slug, description } = topic;
  query = `INSERT INTO topics (slug, description) VALUES ($1, $2) RETURNING *;`;
  return db
    .query(query, [slug, description])
    .then(({ rows }) => {
      return rows[0];
    })
    .catch((err) => {
      return Promise.reject(err);
    });
}

module.exports = { fetchTopics, insertTopic };
