const { getArticles, getArticleById, patchArticle, postCommentByArticleId, getCommentsByArticleId } = require("../controllers/articles.controller");

const articlesRouter = require("express").Router();

articlesRouter.get("/", getArticles);
articlesRouter.route("/:article_id").get(getArticleById).patch(patchArticle);
articlesRouter.route("/:article_id/comments").post(postCommentByArticleId).get(getCommentsByArticleId);

module.exports = articlesRouter;
