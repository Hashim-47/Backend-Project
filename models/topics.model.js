const db = require('../db/connection')

const fetchTopics = () => {
    return db.query('SELECT * FROM topics').then((result) => {
        return result.rows

    })
}

const fetchArticles = () => {
    return db.query('SELECT articles.*, COUNT(comments.article_id) as comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id GROUP BY articles.article_id ORDER BY articles.created_at DESC').then((result) => {
        return result.rows
    })
}

module.exports = {fetchTopics, fetchArticles}