const express = require('express');
const db = require('../config/database');

const router = express.Router();




function isAuthorized(req, res, next) {
  if (req.session.user) {
    next(); 
  } else {
    res.status(401).send('You are not authorized');
  }
}


router.post('/comment/:postId', isAuthorized, (req, res) => {
  const postId = req.params.postId;
  const { content } = req.body;

  const username = req.session.user.username;

  db.query(
    'INSERT INTO comments (post_id, content, username) VALUES (?, ?, ?)',
    [postId, content, username],
    (err) => {
      if (err) {
        console.error('Error creating comment in the database:', err);
        res.status(500).send('Internal Server Error');
        return;
      }

      res.redirect(`/post/${postId}`);
    }
  );
});


module.exports = router;
