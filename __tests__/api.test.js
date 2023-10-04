const app = require("../server");
const request = require("supertest");
const jestSort = require("jest-sorted");

const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");
const endpoints = require("../endpoints.json");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("/api/topics", () => {
  test("GET:200 return all topics", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        const topics = body.topics;
        expect(topics.length).toEqual(3);
        topics.forEach((topic) => {
          expect(typeof topic.slug).toBe("string");
          expect(typeof topic.description).toBe("string");
        });
      });
  });
});

describe("/api/articles", () => {
  test("GET:200 return all articles", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const articles = body.articles;
        expect(articles.length).toBe(13);
        articles.forEach((article) => {
          expect(typeof article.article_id).toBe("number");
          expect(typeof article.title).toBe("string");
          expect(typeof article.topic).toBe("string");
          expect(typeof article.author).toBe("string");
          expect(typeof article.created_at).toBe("string");
          expect(typeof article.votes).toBe("number");
          expect(typeof article.article_img_url).toBe("string");
          expect(typeof article.comment_count).toBe("number");
        });
        expect(articles).toBeSortedBy("created_at", { descending: true });
      });
  });
  test("GET:200 with topic in query", () => {
    return request(app)
      .get("/api/articles?topic=mitch")
      .expect(200)
      .then(({ body }) => {
        const articles = body.articles;
        expect(articles.length).toBe(12);
        articles.forEach((article) => {
          expect(article.topic).toBe("mitch");
        });
      });
  });
  test("GET:200 and empty array when topic not existent", () => {
    return request(app)
      .get("/api/articles?topic=test")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("topic does not exist");
      });
  });
});

describe("/api/articles/:article_id", () => {
  test("GET:200 return 1 article", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        const article = body.article;
        expect(article.article_id).toEqual(1);
        expect(article.title).toEqual("Living in the shadow of a great man");
        expect(article.topic).toEqual("mitch");
        expect(article.author).toEqual("butter_bridge");
        expect(article.body).toEqual("I find this existence challenging");
        expect(article.created_at).toEqual("2020-07-09T20:11:00.000Z");
        expect(article.votes).toEqual(100);
        expect(article.article_img_url).toEqual(
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
        );
        expect(article.comment_count).toBe(11);
      });
  });
  test("GET:404 send appropriate status code / msg when valid id but no existent", () => {
    return request(app)
      .get("/api/articles/1000")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toEqual("article does not exist");
      });
  });
  test("GET:400 send appropriate status code /msg when not valid id", () => {
    return request(app)
      .get("/api/articles/notanid")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("PATCH:200 return updated article", () => {
    const updateArticle = { inc_votes: 5 };
    return request(app)
      .patch("/api/articles/1")
      .send(updateArticle)
      .expect(200)
      .then(({ body }) => {
        const article = body.article;
        expect(article.article_id).toEqual(1);
        expect(article.title).toEqual("Living in the shadow of a great man");
        expect(article.topic).toEqual("mitch");
        expect(article.author).toEqual("butter_bridge");
        expect(article.body).toEqual("I find this existence challenging");
        expect(article.created_at).toEqual("2020-07-09T20:11:00.000Z");
        expect(article.votes).toEqual(105);
        expect(article.article_img_url).toEqual(
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
        );
      });
  });
  test("PATCH:404 send appropriate status code / msg when valid id but no existent", () => {
    const updateArticle = { inc_votes: 5 };
    return request(app)
      .patch("/api/articles/1000")
      .send(updateArticle)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toEqual("article does not exist");
      });
  });
  test("PATCH:400 send appropriate status code /msg when not valid id", () => {
    const updateArticle = { inc_votes: 5 };
    return request(app)
      .patch("/api/articles/notanid")
      .send(updateArticle)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("PATCH:400 send appropriate status code/msg when not valid update article", () => {
    const updateArticle = { inc_vot: "test" };
    return request(app)
      .patch("/api/articles/notanid")
      .send(updateArticle)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
});

describe("/api/articles/:article_id/comments", () => {
  test("POST:201 return new comment added", () => {
    const comment = {
      username: "butter_bridge",
      body: "Jeremy is the best",
    };

    return request(app)
      .post("/api/articles/1/comments")
      .send(comment)
      .expect(201)
      .then(({ body }) => {
        const comment = body.comment;
        expect(comment.comment_id).toBe(19);
        expect(comment.article_id).toBe(1);
        expect(comment.body).toBe("Jeremy is the best");
        expect(comment.author).toBe("butter_bridge");
        expect(comment.votes).toBe(0);
        expect(typeof comment.created_at).toBe("string");
      });
  });
  test("POST:404 send appropriate status code / msg when valid id but not existent", () => {
    const comment = {
      username: "butter_bridge",
      body: "Jeremy is the best",
    };

    return request(app)
      .post("/api/articles/1000/comments")
      .send(comment)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toEqual("article does not exist");
      });
  });
  test("POST:400 send appropriate status code /msg when not valid id", () => {
    const comment = {
      username: "butter_bridge",
      body: "Jeremy is the best",
    };
    return request(app)
      .post("/api/articles/notanid/comments")
      .send(comment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("POST:404 send appropriate status code / msg when username not existent", () => {
    //wrong username, or not correct username will return same (no psql error for username as a number)
    const comment = {
      username: "Jeremy",
      body: "Jeremy is the best",
    };

    return request(app)
      .post("/api/articles/1/comments")
      .send(comment)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toEqual("username does not exist");
      });
  });
  test("POST:400 send appropriate status code /msg when not valid comment", () => {
    const comment = {
      username: "butter_bridge",
      id: "test",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(comment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("GET:200 return comments for an article", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        const comments = body.comments;

        expect(comments.length).toBe(11);

        comments.forEach((comment) => {
          expect(comment.article_id).toBe(1);
          expect(typeof comment.comment_id).toBe("number");
          expect(typeof comment.body).toBe("string");
          expect(typeof comment.author).toBe("string");
          expect(typeof comment.votes).toBe("number");
          expect(typeof comment.created_at).toBe("string");
        });

        expect(comments).toBeSortedBy("created_at", { descending: true });
      });
  });
  test("GET:200 when article exist but does not have comments", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then(({ body }) => {
        const comments = body.comments;
        expect(comments.length).toBe(0);
        expect(typeof comments).toBe("object");
      });
  });

  test("GET:404 send appropriate status code / msg when valid id but no existent", () => {
    return request(app)
      .get("/api/articles/1000/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toEqual("article does not exist");
      });
  });
  test("GET:400 send appropriate status code /msg when not valid id", () => {
    return request(app)
      .get("/api/articles/notanid/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
});

describe("/api/users", () => {
  test("GET:200 return all users", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        const users = body.users;
        expect(users.length).toBe(4);
        users.forEach((user) => {
          expect(typeof user.username).toBe("string");
          expect(typeof user.name).toBe("string");
          expect(typeof user.avatar_url).toBe("string");
        });
      });
  });
});

describe("/api/comments/:comment_id", () => {
  test("DELETE:204 return good status when comment exist", () => {
    return request(app).delete("/api/comments/1").expect(204);
  });
  test("DELETE:404 send appropriate status/msg when comment does not exist", () => {
    return request(app)
      .delete("/api/comments/1000")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("comment does not exist");
      });
  });
  test("DELETE:400 send appropriate status/msg when od not valid", () => {
    return request(app)
      .delete("/api/comments/notanid")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
});

describe("/api", () => {
  test("GET:200 return all api informations", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        const infos = body.endpoints;
        expect(infos).toEqual(endpoints);
      });
  });
});

describe("/*", () => {
  test("*:404 for any request type", () => {
    return request(app)
      .get("/afdf")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toEqual("path not valid");
      });
  });
});
