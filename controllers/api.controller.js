const endpoints = require("../endpoints.json");

function getApiEndpoints(req, res) {
  res.status(200).send({ endpoints });
}

module.exports = { getApiEndpoints };
