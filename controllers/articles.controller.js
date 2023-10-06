const {
  selectArticleById,
  selectArticles,
  selectCommentsByArticleId,
  updateArticle,
  insertCommentByArticleId,
  insertArticle,
  removeArticle,
} = require("../models/articles.model");

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

function getArticles(req, res, next) {
  const { topic, sort_by, order } = req.query;
  selectArticles(topic, sort_by, order)
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch((err) => {
      next(err);
    });
}
function getCommentsByArticleId(req, res, next) {
  const id = req.params.article_id;
  selectCommentsByArticleId(id)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
}

function patchArticle(req, res, next) {
  const id = req.params.article_id;
  const article = req.body;
  updateArticle(id, article)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
}

function postCommentByArticleId(req, res, next) {
  const id = req.params.article_id;
  const comment = req.body;
  insertCommentByArticleId(id, comment)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
}

function postArticle(req, res, next) {
  const article = req.body;
  insertArticle(article)
    .then((article) => {
      res.status(201).send({ article });
    })
    .catch((err) => {
      next(err);
    });
}

function deleteArticle(req, res, next) {
  const id = req.params.article_id;
  removeArticle(id)
    .then(() => {
      res.status(204).send();
    })
    .catch((err) => {
      next(err);
    });
}

module.exports = { getArticleById, getArticles, postCommentByArticleId, getCommentsByArticleId, patchArticle, postArticle, deleteArticle };
