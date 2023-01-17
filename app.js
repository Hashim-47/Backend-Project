const express = require('express');
const { getTopics } = require('./controllers/topics.controller');
const app = express();


app.get('/api/topics', getTopics);

app.all('/*', (req, res) => {
    res.status(404).send({msg: 'Not Found'})
})

app.use((err, req, res, next) => {
    res.status(500).send({msg: 'Internal server error'})
})


module.exports = app 