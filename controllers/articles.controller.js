const { fetchArticles, fetchArticle, fetchArticleComments } = require("../models/articles.model");


const getArticles = (req, res, next) => {
    fetchArticles().then((articles) => {
        res.status(200).send({articles: articles});
    }).catch((err) => {
        next(err)
    })
}

const getArticle = (req, res, next) => {
    const {article_id} = req.params;
    fetchArticle(article_id).then((article) => {
            res.status(200).send({article: article})
    }).catch((err) => {
        next(err)
    })
}

const getArticleComments = (req, res, next) => {
    const {article_id} = req.params;
    fetchArticleComments(article_id).then((comments) => {
        res.status(200).send({comments: comments})
    }).catch((err) => {
        next(err)
    })

}




module.exports = { getArticles, getArticle, getArticleComments}