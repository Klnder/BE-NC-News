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
        const expectedTopic = {
          slug: expect.any(String),
          description: expect.any(String),
        };

        expect(topics.length).toEqual(3);
        topics.forEach((topic) => {
          expect(topic).toEqual(expect.objectContaining(expectedTopic));
        });
      });
  });
});

describe("/api/articles", () => {
  test("GET:200 return all articles sorted by created_at desc by default", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const articles = body.articles;
        const expectedArticle = {
          article_id: expect.any(Number),
          author: expect.any(String),
          title: expect.any(String),
          topic: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          article_img_url: expect.any(String),
          comment_count: expect.any(Number),
        };

        expect(articles.length).toBe(13);
        expect(articles).toBeSortedBy("created_at", { descending: true });

        articles.forEach((article) => {
          expect(article).toEqual(expect.objectContaining(expectedArticle));
        });
      });
  });
  test("GET:200 with topic in query", () => {
    return request(app)
      .get("/api/articles?topic=mitch")
      .expect(200)
      .then(({ body }) => {
        const articles = body.articles;
        const expectedArticle = {
          article_id: expect.any(Number),
          author: expect.any(String),
          title: expect.any(String),
          topic: "mitch",
          created_at: expect.any(String),
          votes: expect.any(Number),
          article_img_url: expect.any(String),
          comment_count: expect.any(Number),
        };
        expect(articles.length).toBe(12);
        articles.forEach((article) => {
          expect(article).toEqual(expect.objectContaining(expectedArticle));
        });
      });
  });
  test("GET:200 with sort_by and order in query", () => {
    return request(app)
      .get("/api/articles?sort_by=author&order=asc")
      .expect(200)
      .then(({ body }) => {
        const articles = body.articles;
        const expectedArticle = {
          article_id: expect.any(Number),
          author: expect.any(String),
          title: expect.any(String),
          topic: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          article_img_url: expect.any(String),
          comment_count: expect.any(Number),
        };
        expect(articles.length).toBe(13);
        expect(articles).toBeSortedBy("author");
        articles.forEach((article) => {
          expect(article).toEqual(expect.objectContaining(expectedArticle));
        });
      });
  });
  test("GET:400 with sort_by not accepted", () => {
    return request(app)
      .get("/api/articles?sort_by=test&order=asc")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("GET:400 with order not accepted", () => {
    return request(app)
      .get("/api/articles?sort_by=author&order=test")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
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
    const expected = {
      article_id: 1,
      title: "Living in the shadow of a great man",
      topic: "mitch",
      author: "butter_bridge",
      body: "I find this existence challenging",
      created_at: "2020-07-09T20:11:00.000Z",
      votes: 100,
      article_img_url: "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
      comment_count: 11,
    };
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        const article = body.article;
        expect(article).toMatchObject(expected);
      });
  });
  test("GET:404 send appropriate status code / msg when valid id but no existent", () => {
    return request(app)
      .get("/api/articles/1000")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("article does not exist");
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

    const expected = {
      article_id: 1,
      title: "Living in the shadow of a great man",
      topic: "mitch",
      author: "butter_bridge",
      body: "I find this existence challenging",
      created_at: "2020-07-09T20:11:00.000Z",
      votes: 105,
      article_img_url: "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
    };

    return request(app)
      .patch("/api/articles/1")
      .send(updateArticle)
      .expect(200)
      .then(({ body }) => {
        const article = body.article;
        expect(article).toMatchObject(expected);
      });
  });
  test("PATCH:404 send appropriate status code / msg when valid id but no existent", () => {
    const updateArticle = { inc_votes: 5 };
    return request(app)
      .patch("/api/articles/1000")
      .send(updateArticle)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("article does not exist");
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
      .patch("/api/articles/1")
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

    const expectedComment = {
      comment_id: 19,
      article_id: 1,
      body: "Jeremy is the best",
      author: "butter_bridge",
      votes: 0,
      created_at: expect.any(String),
    };

    return request(app)
      .post("/api/articles/1/comments")
      .send(comment)
      .expect(201)
      .then(({ body }) => {
        const comment = body.comment;
        expect(comment).toEqual(expect.objectContaining(expectedComment));
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
        expect(body.msg).toBe("article does not exist");
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
        expect(body.msg).toBe("username does not exist");
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
        const expectedComment = {
          article_id: 1,
          comment_id: expect.any(Number),
          body: expect.any(String),
          author: expect.any(String),
          votes: expect.any(Number),
          created_at: expect.any(String),
        };

        expect(comments.length).toBe(11);
        expect(comments).toBeSortedBy("created_at", { descending: true });

        comments.forEach((comment) => {
          expect(comment).toEqual(expect.objectContaining(expectedComment));
        });
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
        expect(body.msg).toBe("article does not exist");
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
        const expectedUser = {
          username: expect.any(String),
          name: expect.any(String),
          avatar_url: expect.any(String),
        };
        users.forEach((user) => {
          expect(user).toEqual(expect.objectContaining(expectedUser));
        });
      });
  });
});

describe("/api/users/:username", () => {
  test("GET:200 return 1 user", () => {
    const expected = {
      username: "butter_bridge",
      name: "jonny",
      avatar_url: "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
    };
    return request(app)
      .get("/api/users/butter_bridge")
      .expect(200)
      .then(({ body }) => {
        const user = body.user;
        expect(user).toMatchObject(expected);
      });
  });
  test("GET:404 send appropriate status code / msg when valid username but not existent", () => {
    return request(app)
      .get("/api/users/test")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("username does not exist");
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
  test("PATCH:200 return updated comment", () => {
    const updateComment = { inc_votes: 5 };

    const expected = {
      comment_id: 1,
      body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
      article_id: 9,
      author: "butter_bridge",
      votes: 21,
      created_at: "2020-04-06T12:17:00.000Z",
    };

    return request(app)
      .patch("/api/comments/1")
      .send(updateComment)
      .expect(200)
      .then(({ body }) => {
        console.log(body.comment);
        const comment = body.comment;
        expect(comment).toMatchObject(expected);
      });
  });
  test("PATCH:404 send appropriate status code / msg when valid id but no existent", () => {
    const updateComment = { inc_votes: 5 };
    return request(app)
      .patch("/api/comments/1000")
      .send(updateComment)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("comment does not exist");
      });
  });
  test("PATCH:400 send appropriate status code /msg when not valid id", () => {
    const updateComment = { inc_votes: 5 };
    return request(app)
      .patch("/api/comments/notanid")
      .send(updateComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("PATCH:400 send appropriate status code/msg when not valid update article", () => {
    const updateArticle = { inc_vot: "test" };
    return request(app)
      .patch("/api/comments/1")
      .send(updateArticle)
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
        expect(body.msg).toBe("path not valid");
      });
  });
});
