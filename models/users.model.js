const db = require("../db/connection");

function selectUsers() {
  const query = `SELECT * FROM users;`;
  return db.query(query).then(({ rows }) => {
    return rows;
  });
}

module.exports = { selectUsers };
