const express = require('express');
const router = express.Router();
const db = require('../config/database');






router.get('/:id', (req, res) => {
    const postId = req.params.id;
  
    db.query('SELECT * FROM posts WHERE id = ?', postId, (err, postResults) => {
      if (err) {
        console.error('Error fetching post from the database:', err);
        res.status(500).send('Internal Server Error');
        return;
      }
  
      db.query('SELECT * FROM comments WHERE post_id = ?', postId, (err, commentsResults) => {
        if (err) {
          console.error('Error fetching comments from the database:', err);
          res.status(500).send('Internal Server Error');
          return;
        }
  
        res.render('post', { post: postResults[0], comments: commentsResults });
      });
    });
  });
  

function isAuthorized(req, res, next) {
  if (req.session.user) {
    next(); 
  } else {
    res.status(401).send('Ви не авторизовані');
  }
}


router.post('/:topicId', isAuthorized, (req, res) => {
  const topicId = req.params.topicId;
  const { title, content } = req.body;

  const username = req.session.user.username;

  db.query(
    'INSERT INTO posts (topic_id, content, title, username) VALUES (?, ?, ?, ?)',
    [topicId, content, title, username],
    (err) => {
      if (err) {
        console.error('Error creating comment in the database:', err);
        res.status(500).send('Internal Server Error');
        return;
      }

      res.redirect(`/topic/${topicId}`);
    }
  );
});


module.exports = router;
