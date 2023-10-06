const {
  getArticles,
  getArticleById,
  patchArticle,
  postCommentByArticleId,
  getCommentsByArticleId,
  postArticle,
} = require("../controllers/articles.controller");

const articlesRouter = require("express").Router();

articlesRouter.route("/").get(getArticles).post(postArticle);
articlesRouter.route("/:article_id").get(getArticleById).patch(patchArticle);
articlesRouter.route("/:article_id/comments").post(postCommentByArticleId).get(getCommentsByArticleId);

module.exports = articlesRouter;
