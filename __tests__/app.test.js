const db = require('../db/connection')
const app = require('../app')
const request = require('supertest')
const seed = require('../db/seeds/seed')
const testData = require('../db/data/test-data/index')
require('jest-sorted');

beforeEach(() => {
    return seed(testData)
})

afterAll(() => {
    return db.end()
})

describe('GET /api/topics', () => {
test('Respond with status code 200 and an array of topic objects, each of which should have a slug and description property', () => {
    return request(app).get('/api/topics')
    .expect(200)
    .then((res) => {
        expect(res.body.topics.length).toBeGreaterThan(1)
        res.body.topics.forEach(topic => {
            expect(topic).toHaveProperty('slug');
            expect(topic).toHaveProperty('description');
        });
    })
})


test('Respond with 404 Not Found when endpoint is incorrect', () => {
    return request(app)
    .get('/incorrect-endpoint')
    .expect(404)
    .then(({body}) => {
        expect(body.msg).toBe('Not Found')
    })
})
})

describe('GET /api/articles', () => {

test("Respond with code 200 and get all articles with correct properties", () => {
    return request(app).get("/api/articles")
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
})
})

test("Respond with code 200 and sort all articles by date in descending order", () => {
    return request(app).get("/api/articles")
    .expect(200)
    .then((res) => {
    const articles = res.body.articles
    expect(res.body.articles.length).toBeGreaterThan(1);
    expect(articles).toBeSortedBy('created_at', {descending: true});
})
})

describe('GET /api/articles/:id', () =>{
    test("Respond with code 200 and an article object with correct properties", () => {
        return request(app).get("/api/articles/1")
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

    test("Respond with code 404 when article id does not exist", () => {
        return request(app).get("/api/articles/4747")
        .expect(404)
        .then(({body}) => {
        expect(body.msg).toBe("Not Found");
   })
})

test("Respond with code 400 when article id does not exist", () => {
    return request(app).get("/api/articles/word")
    .expect(400)
    .then(({body}) => {
    expect(body.msg).toBe("Bad Request");
})
})
})
})

describe('GET /api/articles/:id/comments', () =>{

    test('Responds with code 200 and an empty array when passed an article with no comments', () => {
        return request(app).get("/api/articles/2/comments")
        .expect(200)
        .then(({body}) => {
            expect(body.comments.length).toEqual(0)
        })
    })

    test("Respond with code 200 and an array of comments for the article found by article_id", () => {
        return request(app).get("/api/articles/1/comments")
        .expect(200)
        .then(({body}) => {
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
        })
    });

    test("Respond with code 404 when article id does not exist when looking for comments", () => {
        return request(app).get("/api/articles/4747/comments")
        .expect(404)
        .then(({body}) => {
        expect(body.msg).toBe("Not Found");
   })
})

test("Respond with code 400 when article id does not exist when looking for comments", () => {
    return request(app).get("/api/articles/word/comments")
    .expect(400)
    .then(({body}) => {
    expect(body.msg).toBe("Bad Request");
})
})

test("Respond with code 200 and sort all comments by date in descending order", () => {
    return request(app).get("/api/articles/1/comments")
    .expect(200)
    .then(({body}) => {
    const comments = body.comments
    expect(comments.length).toBeGreaterThan(1);
    expect(comments).toBeSortedBy('created_at', {descending: true});
})
})
})

describe("POST", () => {    

    test("Respond with status code 201 and posts the new comment", () => {
    const newComment = { username: "butter_bridge", body: "This is a test comment" };
    return request(app).post("/api/articles/1/comments") 
    .send(newComment)       
    .expect(201)        
    .then(({body}) => {
     expect(body.comment).toEqual({
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(String),
            body: 'This is a test comment',
            author: 'butter_bridge',
            article_id: 1,
        })
    })
})

test("Respond with code 404 when article id does not exist", () => {
    return request(app).post("/api/articles/4747/comments")
    .expect(404)
    .then(({body}) => {
    expect(body.msg).toBe("Not Found");

})
})

test("Respond with code 400 when article id is invalid", () => {
    const newComment = { username: "butter_bridge", body: "This is a test comment" };
    return request(app).post("/api/articles/word/comments")
    .send(newComment)
    .expect(400)
    .then(({body}) => {
    expect(body.msg).toBe("Bad Request");
})
})

test("Respond with code 404 when username does not exist", () => {
    const newComment = { username: "invalid_username", body: "This is a test comment" };
    return request(app).post("/api/articles/1/comments")
    .send(newComment)
    .expect(404)
    .then(({body}) => {
    expect(body.msg).toBe("Not Found");
})
})

test("Respond with code 400 when body is missing", () => {
    const newComment = { username: "butter_bridge"};
    return request(app).post("/api/articles/1/comments")
    .send(newComment)
    .expect(400)
    .then(({body}) => {
    expect(body.msg).toBe("Bad Request");
})
})

})
