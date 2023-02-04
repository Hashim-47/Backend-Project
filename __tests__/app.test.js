const db = require("../db/connection");
const app = require("../app");
const request = require("supertest");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index");
const { response } = require("express");
require("jest-sorted");

beforeEach(() => {
  return seed(testData);
});

afterAll(() => {
  return db.end();
});

describe("GET /api/topics", () => {
  test("Respond with status code 200 and an array of topic objects, each of which should have a slug and description property", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then((res) => {
        expect(res.body.topics.length).toBeGreaterThan(1);
        res.body.topics.forEach((topic) => {
          expect(topic).toHaveProperty("slug");
          expect(topic).toHaveProperty("description");
        });
      });
  });

  describe("POST /api/topics", () => {
    test("Respond with status code 201 and posts the new topic", () => {
      const newTopic = {
        slug: "Gaming",
        description: "Best Games",
      };
      return request(app)
        .post("/api/topics")
        .send(newTopic)
        .expect(201)
        .then(({ body }) => {
          expect(body.topic).toEqual({
            slug: "Gaming",
            description: "Best Games",
          });
        });
    });

    test("Respond with code 400 when slug already exits", () => {
      const newTopic = {
        slug: "cats",
        description: "",
      };
      return request(app)
        .post("/api/topics")
        .send(newTopic)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad Request");
        });
    });

    test("Respond with code 400 when a property is missing", () => {
      const newTopic = {
        slug: "Gaming",
      };
      return request(app)
        .post("/api/topics")
        .send(newTopic)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad Request");
        });
    });
  });

  test("Respond with 404 Not Found when endpoint is incorrect", () => {
    return request(app)
      .get("/incorrect-endpoint")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not Found");
      });
  });
});

describe("POST /api/articles", () => {
  test("Respond with status code 201 and posts the new article", () => {
    const newArticle = {
      author: "butter_bridge",
      body: "This is a test article",
      title: "title",
      topic: "cats",
      article_img_url:
        "https://cdn.britannica.com/76/92676-050-F91A67C7/Sumatran-tiger-water.jpg",
    };
    return request(app)
      .post("/api/articles")
      .send(newArticle)
      .expect(201)
      .then(({ body }) => {
        expect(body.article).toEqual({
          article_id: expect.any(Number),
          votes: expect.any(Number),
          created_at: expect.any(String),
          comment_count: expect.any(String),
          body: "This is a test article",
          author: "butter_bridge",
          topic: "cats",
          title: "title",
          article_img_url:
            "https://cdn.britannica.com/76/92676-050-F91A67C7/Sumatran-tiger-water.jpg",
        });
      });
  });

  test("Respond with status code 201 and posts the new article when not given image", () => {
    const newArticle = {
      author: "butter_bridge",
      body: "This is a test article",
      title: "title",
      topic: "cats",
    };
    return request(app)
      .post("/api/articles")
      .send(newArticle)
      .expect(201)
      .then(({ body }) => {
        expect(body.article).toEqual({
          article_id: expect.any(Number),
          votes: expect.any(Number),
          created_at: expect.any(String),
          comment_count: expect.any(String),
          body: "This is a test article",
          author: "butter_bridge",
          topic: "cats",
          title: "title",
          article_img_url: expect.any(String),
        });
      });
  });

  test("Respond with code 404 when author does not exist", () => {
    const newArticle = {
      author: "invalid",
      body: "This is a test article",
      title: "title",
      topic: "cats",
      article_img_url:
        "https://cdn.britannica.com/76/92676-050-F91A67C7/Sumatran-tiger-water.jpg",
    };
    return request(app)
      .post("/api/articles")
      .send(newArticle)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not Found");
      });
  });

  test("Respond with code 400 when a property is missing", () => {
    const newArticle = {
      author: "butter_bridge",
      title: "title",
      topic: "cats",
      article_img_url:
        "https://cdn.britannica.com/76/92676-050-F91A67C7/Sumatran-tiger-water.jpg",
    };
    return request(app)
      .post("/api/articles")
      .send(newArticle)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
});

describe("GET /api/articles", () => {
  test("Respond with code 200 and get all articles with correct properties", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((res) => {
        expect(res.body.articles.length).toBeGreaterThan(1);
        res.body.articles.forEach((article) => {
          expect(article).toHaveProperty("author");
          expect(article).toHaveProperty("title");
          expect(article).toHaveProperty("article_id");
          expect(article).toHaveProperty("topic");
          expect(article).toHaveProperty("created_at");
          expect(article).toHaveProperty("votes");
          expect(article).toHaveProperty("article_img_url");
          expect(article).toHaveProperty("comment_count");
        });
      });
  });

  test("Respond with code 200 and filtered articles by topic (mitch)", () => {
    return request(app)
      .get("/api/articles?topic=mitch")
      .expect(200)
      .then(({ body }) => {
        body.articles.forEach((article) => {
          expect(article.topic).toEqual("mitch");
        });
      });
  });

  test("Respond with code 404 when querying for non-existent topic", () => {
    return request(app)
      .get("/api/articles?topic=nonexistent")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not Found");
      });
  });

  test("Respond with code 200 and filtered articles by sort by (title) - default descending", () => {
    return request(app)
      .get("/api/articles?sort_by=title")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSortedBy("title", { descending: true });
      });
  });

  test("Respond with code 200 and sort all articles by date in descending order", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((res) => {
        const articles = res.body.articles;
        expect(res.body.articles.length).toBeGreaterThan(1);
        expect(articles).toBeSortedBy("created_at", { descending: true });
      });
  });

  test("Respond with code 400 and when given invalid sort by", () => {
    return request(app)
      .get("/api/articles?sort_by=invalid")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });

  test("Respond with code 200 and sort all articles by date in ascending order (ASC)", () => {
    return request(app)
      .get("/api/articles?order=ASC")
      .expect(200)
      .then((res) => {
        const articles = res.body.articles;
        expect(res.body.articles.length).toBeGreaterThan(1);
        expect(articles).toBeSortedBy("created_at", { ascending: true });
      });
  });

  test("Respond with code 400 and when given invalid order", () => {
    return request(app)
      .get("/api/articles?order=invalid")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });

  test("Respond with code 200 and results limited to 10 by default", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles.length).toBe(10);
      });
  });

  test("Respond with code 200 and 2 results on page 2", () => {
    return request(app)
      .get("/api/articles?p=2")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles.length).toBe(2);
      });
  });

  test("Respond with code 200 and results limited to 11", () => {
    return request(app)
      .get("/api/articles?limit=11")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles.length).toBe(11);
      });
  });

  test("Respond with code 400 when p is not a number", () => {
    return request(app)
      .get("/api/articles?p=test")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });

  test("Respond with code 400 when limit is not a number", () => {
    return request(app)
      .get("/api/articles?limit=test")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });

  describe("GET /api/articles/:id", () => {
    test("Respond with code 200 and an article object with correct properties", () => {
      return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then((res) => {
          const article = res.body.article;
          expect(article).toHaveProperty("author");
          expect(article).toHaveProperty("title");
          expect(article).toHaveProperty("article_id");
          expect(article).toHaveProperty("body");
          expect(article).toHaveProperty("topic");
          expect(article).toHaveProperty("created_at");
          expect(article).toHaveProperty("votes");
          expect(article).toHaveProperty("article_img_url");
        });
    });

    test("Respond with code 200 and an article object with comment count property", () => {
      return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then((res) => {
          const article = res.body.article;
          expect(article).toHaveProperty("comment_count");
        });
    });

    test("Respond with code 404 when article id does not exist", () => {
      return request(app)
        .get("/api/articles/4747")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Not Found");
        });
    });

    test("Respond with code 400 when article id does not exist", () => {
      return request(app)
        .get("/api/articles/word")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad Request");
        });
    });
  });
});

describe("GET /api/articles/:id/comments", () => {
  test("Responds with code 200 and an empty array when passed an article with no comments", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments.length).toEqual(0);
      });
  });

  test("Respond with code 200 and an array of comments for the article found by article_id", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments.length).toBeGreaterThan(1);
        body.comments.forEach((comment) => {
          expect(comment).toHaveProperty("comment_id");
          expect(comment).toHaveProperty("votes");
          expect(comment).toHaveProperty("created_at");
          expect(comment).toHaveProperty("author");
          expect(comment).toHaveProperty("body");
          expect(comment).toHaveProperty("votes");
          expect(comment).toHaveProperty("article_id");
          expect(comment.article_id).toEqual(1);
        });
      });
  });

  test("Respond with code 404 when article id does not exist when looking for comments", () => {
    return request(app)
      .get("/api/articles/4747/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not Found");
      });
  });

  test("Respond with code 400 when article id does not exist when looking for comments", () => {
    return request(app)
      .get("/api/articles/word/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });

  test("Respond with code 200 and sort all comments by date in descending order", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        const comments = body.comments;
        expect(comments.length).toBeGreaterThan(1);
        expect(comments).toBeSortedBy("created_at", { descending: true });
      });
  });

  test("Respond with code 200 and results limited to 10 by default", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments.length).toBe(10);
      });
  });

  test("Respond with code 200 and 1 result on page 2", () => {
    return request(app)
      .get("/api/articles/1/comments?p=2")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments.length).toBe(1);
      });
  });

  test("Respond with code 200 and results limited to 9", () => {
    return request(app)
      .get("/api/articles/1/comments?limit=9")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments.length).toBe(9);
      });
  });

  test("Respond with code 400 when p is not a number", () => {
    return request(app)
      .get("/api/articles/1/comments?p=test")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });

  test("Respond with code 400 when limit is not a number", () => {
    return request(app)
      .get("/api/articles/1/comments?limit=test")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
});

describe("POST", () => {
  test("Respond with status code 201 and posts the new comment", () => {
    const newComment = {
      username: "butter_bridge",
      body: "This is a test comment",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(201)
      .then(({ body }) => {
        expect(body.comment).toEqual({
          comment_id: expect.any(Number),
          votes: expect.any(Number),
          created_at: expect.any(String),
          body: "This is a test comment",
          author: "butter_bridge",
          article_id: 1,
        });
      });
  });

  test("Respond with code 404 when article id does not exist", () => {
    return request(app)
      .post("/api/articles/4747/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not Found");
      });
  });

  test("Respond with code 400 when article id is invalid", () => {
    const newComment = {
      username: "butter_bridge",
      body: "This is a test comment",
    };
    return request(app)
      .post("/api/articles/word/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });

  test("Respond with code 404 when username does not exist", () => {
    const newComment = {
      username: "invalid_username",
      body: "This is a test comment",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not Found");
      });
  });

  test("Respond with code 400 when body is missing", () => {
    const newComment = { username: "butter_bridge" };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
});

describe("PATCH", () => {
  test("Respond with code 200 and increment votes by value received - return object", () => {
    const incrementVotes = { inc_votes: 47 };
    return request(app)
      .patch("/api/articles/1")
      .send(incrementVotes)
      .expect(200)
      .then(({ body }) => {
        expect(body.result).toMatchObject({
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: expect.any(String),
          votes: 147,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
        return request(app)
          .get("/api/articles/1")
          .expect(200)
          .then(({ body }) => {
            expect(body.article.votes).toEqual(147);
          });
      });
  });

  test("Respond with code 200 and decreases votes by 47 - return object", () => {
    const decreaseVotes = { inc_votes: -47 };
    return request(app)
      .patch("/api/articles/1")
      .send(decreaseVotes)
      .expect(200)
      .then(({ body }) => {
        expect(body.result).toMatchObject({
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: expect.any(String),
          votes: 53,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
        return request(app)
          .get("/api/articles/1")
          .expect(200)
          .then(({ body }) => {
            expect(body.article.votes).toEqual(53);
          });
      });
  });

  test("Respond with code 404 when article id does not exist while attempting to patch", () => {
    return request(app)
      .patch("/api/articles/4747")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not Found");
      });
  });

  test("Respond with code 400 when article id is invalid while attempting to patch", () => {
    const newComment = {
      username: "butter_bridge",
      body: "This is a test comment",
    };
    return request(app)
      .patch("/api/articles/word")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });

  test("Respond with code 400 when the increment value is not a number", () => {
    const incrementVotes = { inc_votes: "word" };
    return request(app)
      .patch("/api/articles/1")
      .send(incrementVotes)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
});

describe("GET /api/users", () => {
  test("Respond with status code 200 and an array of user objects, each with the correct properties", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then((res) => {
        expect(res.body.users.length).toBeGreaterThan(1);
        res.body.users.forEach((user) => {
          expect(user).toHaveProperty("username");
          expect(user).toHaveProperty("name");
          expect(user).toHaveProperty("avatar_url");
        });
      });
  });
  test("Respond with status code 200 and a user object with the correct properties", () => {
    return request(app)
      .get("/api/users/butter_bridge")
      .expect(200)
      .then((res) => {
        expect(res.body.user.username).toBe("butter_bridge");
        expect(res.body.user).toHaveProperty("name");
        expect(res.body.user).toHaveProperty("avatar_url");
      });
  });
  test("Respond with status code 404 and if username does not exist", () => {
    return request(app)
      .get("/api/users/random")
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("Not Found");
      });
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  test("respond with code 204 and delete the given comment by comment_id", () => {
    return request(app)
      .delete("/api/comments/1")
      .expect(204)
      .then(() => {
        return request(app)
          .delete("/api/comments/1")
          .expect(404)
          .then((result) => {
            expect(result.body.msg).toBe("Not Found");
          });
      });
  });

  test("respond with code 404 comment id does not exist", () => {
    return request(app)
      .delete("/api/comments/999")
      .expect(404)
      .then((result) => {
        expect(result.body.msg).toBe("Not Found");
      });
  });

  test("respond with code 400 comment id is invalid", () => {
    return request(app)
      .delete("/api/comments/invalid")
      .expect(400)
      .then((result) => {
        expect(result.body.msg).toBe("Bad Request");
      });
  });
});

describe("PATCH /api/comments/:comment_id", () => {
  test("Respond with code 200 when given correct body and votes have been incremented", () => {
    return request(app)
      .patch("/api/comments/1")
      .send({ inc_votes: 1 })
      .expect(200)
      .then((result) => {
        expect(result.body.comment).toHaveProperty("comment_id");
        expect(result.body.comment).toHaveProperty("body");
        expect(result.body.comment).toHaveProperty("author");
        expect(result.body.comment).toHaveProperty("article_id");
        expect(result.body.comment).toHaveProperty("created_at");
        expect(result.body.comment.votes).toBe(17);
      });
  });
  test("respond with code 404 comment id does not exist", () => {
    return request(app)
      .patch("/api/comments/999")
      .expect(404)
      .then((result) => {
        expect(result.body.msg).toBe("Not Found");
      });
  });

  test("respond with code 400 comment id is invalid", () => {
    return request(app)
      .patch("/api/comments/invalid")
      .expect(400)
      .then((result) => {
        expect(result.body.msg).toBe("Bad Request");
      });
  });
});

describe("GET /api", () => {
  test("Respond with code 200 and all endpoints", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then((res) => {
        expect(res.body).toEqual(
          expect.objectContaining({
            "GET /api": expect.any(Object),
            "GET /api/topics": expect.any(Object),
            "GET /api/articles": expect.any(Object),
            "GET /api/articles/:article_id": expect.any(Object),
            "GET /api/articles/:article_id/comments": expect.any(Object),
            "POST /api/articles/:article_id/comments": expect.any(Object),
            "PATCH /api/articles/:article_id": expect.any(Object),
            "GET /api/users": expect.any(Object),
            "DELETE /api/comments/:comment_id": expect.any(Object),
          })
        );
      });
  });
});

describe("DELETE /api/articles/:article_id", () => {
  test("respond with code 204 and delete the given article by article_id", () => {
    return request(app)
      .delete("/api/articles/1")
      .expect(204)
      .then(() => {
        return request(app)
          .delete("/api/articles/1")
          .expect(404)
          .then((result) => {
            expect(result.body.msg).toBe("Not Found");
          });
      });
  });

  test("respond with code 404 article id does not exist", () => {
    return request(app)
      .delete("/api/articles/999")
      .expect(404)
      .then((result) => {
        expect(result.body.msg).toBe("Not Found");
      });
  });

  test("respond with code 400 article id is invalid", () => {
    return request(app)
      .delete("/api/articles/invalid")
      .expect(400)
      .then((result) => {
        expect(result.body.msg).toBe("Bad Request");
      });
  });
});
