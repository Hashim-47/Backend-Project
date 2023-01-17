const { fetchTopics, fetchArticles } = require("../models/topics.model");

const getTopics = (req, res, next) => {
    fetchTopics().then((topics) => {
        res.status(200).send({topics: topics});
    }).catch((err) => {
        next(err)
    })
}

const getArticles = (req, res, next) => {
    fetchArticles().then((articles) => {
        res.status(200).send({articles: articles});
    }).catch((err) => {
        console.log(err);
        next(err)
    })
}

module.exports = {getTopics, getArticles}