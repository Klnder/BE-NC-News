const express = require("express");
const { handlePsqlErrors, handleCustomErrors } = require("./controllers/errors.controller");
const { getTopics } = require("./controllers/topics.controller");
const app = express();

// Middleware Connections
app.use(express.json());

// Routes
app.get("/api/topics", getTopics);

app.all("/*", (req, res, next) => {
  res.status(404).send({ msg: "path not valid" });
});

//Error handling middleware
app.use(handlePsqlErrors);
app.use(handleCustomErrors);

module.exports = app;
