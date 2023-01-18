const db = require('../db/connection')

const fetchArticles = () => {
    return db.query('SELECT articles.*, COUNT(comments.article_id) as comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id GROUP BY articles.article_id ORDER BY articles.created_at DESC').then((result) => {
        return result.rows
    })
}

const fetchArticle = (article_id) => {
    return db.query('SELECT * FROM articles WHERE article_id = $1', [article_id]).then((result) => {
        if(result.rows.length === 0){
        return Promise.reject({status: 404, msg: 'Not Found'})
        }
        return result.rows[0]
    })
}

const fetchArticleComments = (article_id) => {
    return fetchArticle(article_id).then((result) =>{
        if(result){
            return db.query('SELECT * FROM comments WHERE article_id = $1 ORDER BY comments.created_at DESC', [article_id]).then((result) => {
                return result.rows
            })
        }
    })
    
    
}




module.exports = { fetchArticles, fetchArticle, fetchArticleComments}