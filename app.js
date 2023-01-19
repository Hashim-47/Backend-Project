const express = require('express');
const { getTopics } = require('./controllers/topics.controller');
const { getArticles, getArticle, getArticleComments, postComment } = require('./controllers/articles.controller');
const app = express();

app.use(express.json())

app.get('/api/topics', getTopics);
app.get('/api/articles', getArticles);
app.get('/api/articles/:article_id', getArticle)
app.get('/api/articles/:article_id/comments', getArticleComments)
app.post('/api/articles/:article_id/comments', postComment)

app.all('/*', (req, res) => {
    res.status(404).send({msg: 'Not Found'})
})

app.use((err, req, res, next) => {
    if(err.status && err.msg){
        res.status(err.status).send({msg: err.msg})
    } else {
        next(err)
    }
})

app.use((err, req, res,next) => {
    if(err.code === '22P02'){
        res.status(400).send({msg: 'Bad Request'})
    } else{
        next(err)
    }
})

app.use((err, req, res, next) => {
    res.status(500).send({msg: 'Internal server error'})
})


module.exports = app 