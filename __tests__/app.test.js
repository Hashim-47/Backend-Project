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
})
