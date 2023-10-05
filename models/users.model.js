const db = require("../db/connection");

function selectUsers() {
  const query = `SELECT * FROM users;`;
  return db.query(query).then(({ rows }) => {
    return rows;
  });
}

function selectUserByUsername(username) {
  const query = `SELECT * FROM users 
  WHERE username = $1`;
  return db.query(query, [username]).then(({ rows }) => {
    if (!rows[0]) return Promise.reject({ status: 404, msg: "username does not exist" });
    return rows[0];
  });
}

module.exports = { selectUsers, selectUserByUsername };
