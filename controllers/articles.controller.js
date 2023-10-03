const { selectArticleById } = require("../models/articles.model");

function getArticleById(req, res, next) {
  const id = req.params.article_id;
  selectArticleById(id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
}

module.exports = { getArticleById };
