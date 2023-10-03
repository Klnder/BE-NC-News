function handlePsqlErrors(err, req, res, next) {
  if (err.code === "22P02" || err.code === "23502") {
    res.status(400).send({ msg: "Bad request" });
  } else {
    next(err);
  }
}

function handleCustomErrors(err, req, res, next) {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
}
function handle500Errors(err, req, res, next) {
  console.log(err, "Error not handle");
  res.status(500).send({ msg: "Server Error" });
}

module.exports = { handleCustomErrors, handlePsqlErrors, handle500Errors };
