const express = require("express");
const { handlePsqlErrors, handleCustomErrors, handle500Errors } = require("./controllers/errors.controller");
const { getTopics } = require("./controllers/topics.controller");
const { getArticleById, getArticles, getCommentsByArticleId, patchArticle, postCommentByArticleId } = require("./controllers/articles.controller");
const { getApiEndpoints } = require("./controllers/api.controller");
const { getUsers } = require("./controllers/users.controller");
const { deleteComment } = require("./controllers/comments.controller");
const apiRouter = require("./routes/api-router");
const app = express();

// Middleware Connections
app.use(express.json());

// Routes
app.use("/api", apiRouter);

app.all("/*", (req, res, next) => {
  res.status(404).send({ msg: "path not valid" });
});

//Error handling middleware
app.use(handlePsqlErrors);
app.use(handleCustomErrors);
app.use(handle500Errors);

module.exports = app;
