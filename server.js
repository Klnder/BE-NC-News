const express = require("express");
const cors = require("cors");

const { handlePsqlErrors, handleCustomErrors, handle500Errors } = require("./controllers/errors.controller");
const apiRouter = require("./routes/api-router");
const app = express();

app.use(cors());

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
