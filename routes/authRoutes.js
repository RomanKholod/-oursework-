const express = require('express');
const passport = require('passport');
const db = require('../config/database');

const router = express.Router();

router.get('/register', (req, res) => {
  res.render('register');
});

router.post('/register', (req, res) => {
  const { username, password } = req.body;

  db.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, password], (err) => {
    if (err) {
      console.error('Error registering user in the database:', err);
      res.status(500).send('Internal Server Error');
      return;
    }
    

    res.redirect('/login');
    
  });
});

router.get('/', (req, res) => {
  db.query('SELECT * FROM topics ORDER BY created_at DESC', (err, results) => {
    if (err) {
      console.error('Error fetching posts from the database:', err);
      res.status(500).send('Internal Server Error');
      return;
    }

    if (req.session.user) {
      
      res.render('index', { topics: results, user: req.session.user });
    } else {
      
      res.render('index', { topics: results, user: null });
    }
  });
});

router.get('/register', (req, res) => {
  res.render('register');
});


function isAuthorized(req, res, next) {
  if (req.session.user) {
    next(); 
  } else {
    res.status(401).send('You are not authorized');
  }
}

router.post('/create', isAuthorized, (req, res) => {
  const { title, content } = req.body;

  const username = req.session.user.username;

  db.query(
    'INSERT INTO topics (title, content, username) VALUES (?, ?, ?)',
    [title, content, username],
    (err) => {
      if (err) {
        console.error('Error creating post in the database:', err);
        res.status(500).send('Internal Server Error');
        return;
      }
      res.redirect('/');
    }
  );
});

module.exports = router;
