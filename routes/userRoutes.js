const express = require('express');
const router = express.Router();
const passport = require('../config/passport');
const db = require('../config/database');
const app = express()
app.use = (express.json());

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

router.get('/login', (req, res) => {
  res.render('login' ,{ info: req.flash('error')[0] });
});

router.post('/login', (req, res) => {
  const { username, password } = req.body;

  db.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], (err, userResults) => {
    if (err) {
      console.error('Error during login:', err);
      return res.status(500).send('Internal Server Error');
    }

    if (userResults.length === 0) {
      return res.status(401).send('Неправильний пароль або логін');
    }

    const user = userResults[0];

   
    req.session.user = { id: user.id, username: user.username };

    res.redirect('/');
  });
});

router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error('Error logging out:', err);
      res.redirect('/');
      return;
    }
    res.redirect('/');
  });
});

module.exports = router;
