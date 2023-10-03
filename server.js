const express = require("express");
const { handlePsqlErrors, handleCustomErrors, handle500Errors } = require("./controllers/errors.controller");
const { getTopics } = require("./controllers/topics.controller");
const { getArticleById, getArticles } = require("./controllers/articles.controller");
const { getApiEndpoints } = require("./controllers/api.controller");
const app = express();
const port = 3000;

// Middleware Connections
app.use(express.json());

// Routes
app.get("/api/topics", getTopics);
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api", getApiEndpoints);

app.all("/*", (req, res, next) => {
  res.status(404).send({ msg: "path not valid" });
});

//Error handling middleware
app.use(handlePsqlErrors);
app.use(handleCustomErrors);
app.use(handle500Errors);

//listening
app.listen(port, () => {
  console.log(`API listening on port ${port}`);
});

module.exports = app;