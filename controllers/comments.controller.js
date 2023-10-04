const { removeComment } = require("../models/comments.model");

function deleteComment(req, res, next) {
  const id = req.params.comment_id;
  removeComment(id)
    .then(() => {
      res.status(204).send();
    })
    .catch((err) => {
      next(err);
    });
}

module.exports = { deleteComment };
