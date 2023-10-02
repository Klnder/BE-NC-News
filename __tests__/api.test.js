const app = require("../server");
const request = require("supertest");
const fs = require("fs/promises");

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

describe("/api", () => {
  test("GET:200 return all api informations", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        const infos = body.endpoints;
        expect(infos).toEqual(endpoints);
        for (const info in infos) {
          expect(infos[info]).toHaveProperty("description");
          expect(infos[info]).toHaveProperty("queries");
          expect(infos[info]).toHaveProperty("exampleResponse");
        }
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
