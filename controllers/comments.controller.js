const { updateArticle } = require("../models/articles.model");
const { removeComment, updateComment } = require("../models/comments.model");

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

function patchComment(req, res, next) {
  const id = req.params.comment_id;
  const comment = req.body;
  updateComment(id, comment)
    .then((comment) => {
      res.status(200).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
}

module.exports = { deleteComment, patchComment };
