const db = require('../db/connection')
const app = require('../app')
const request = require('supertest')
const seed = require('../db/seeds/seed')
const testData = require('../db/data/test-data/index')

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