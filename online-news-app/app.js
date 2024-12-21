const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const articleRouter = require('./routes/articles');
const authRouter = require('./routes/auth');
require('dotenv').config();

const app = express();

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true });

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false
}));

app.use('/articles', articleRouter);
app.use('/auth', authRouter);

app.get('/', (req, res) => {
  res.redirect('/articles');
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

// filepath: /c:/Users/FARIHA/OneDrive/Desktop/news-app/online-news-app/routes/articles.js
const router = express.Router();
const Article = require('../models/Article');

function isAuthenticated(req, res, next) {
  if (req.session.userId) {
    return next();
  } else {
    res.redirect('/auth/login');
  }
}

// Get all articles
router.get('/', isAuthenticated, async (req, res) => {
  const articles = await Article.find().sort({ createdAt: 'desc' });
  res.render('index', { articles: articles });
});

// New article form
router.get('/new', isAuthenticated, (req, res) => {
  res.render('new', { article: new Article() });
});

// Create article
router.post('/', isAuthenticated, async (req, res) => {
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