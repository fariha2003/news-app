const express = require('express');
const router = express.Router();
const Article = require('../models/Article');

// Get all articles
router.get('/', async (req, res) => {
  const articles = await Article.find().sort({ createdAt: 'desc' });
  res.render('index', { articles: articles });
});

// New article form
router.get('/new', (req, res) => {
  res.render('new', { article: new Article() });
});

// Create article
router.post('/', async (req, res) => {
  const article = new Article({
    title: req.body.title,
    content: req.body.content
  });
  try {
    await article.save();
    res.redirect('/');
  } catch (e) {
    res.render('new', { article: article });
  }
});

module.exports = router;