const express = require('express');
const db = require('../config/database');

const router = express.Router();


function isAuthorized(req, res, next) {
  if (req.user) {
    next(); 
  } else {
    res.status(401).send('Ви не авторизовані');
  }
}

router.get('/edit-comment/:id', isAuthorized, (req, res) => {
  const commentId = req.params.id;

  db.query('SELECT * FROM comments WHERE id = ?', commentId, (err, results) => {
    if (err) {
      console.error('Error fetching comment from the database:', err);
      res.status(500).send('Internal Server Error');
      return;
    }

    const comment = results[0];

    
    if (req.user.username !== comment.username) {
      res.status(403).send('У вас не має дозволу на редагування цього допису');
      return;
    }

    res.render('edit-comment', { comment });
  });
});

router.post('/edit-comment/:id', isAuthorized, (req, res) => {
  const commentId = req.params.id;
  const { content } = req.body;

  db.query('UPDATE comments SET content = ? WHERE id = ?', [content, commentId], (err, results) => {
    if (err) {
      console.error('Error updating comment in the database:', err);
      res.status(500).send('Internal Server Error');
      return;
    }

    res.redirect(`/`);
  });
});

router.get('/edit-post/:id', isAuthorized, (req, res) => {
  const postId = req.params.id;

  db.query('SELECT * FROM posts WHERE id = ?', postId, (err, results) => {
    if (err) {
      console.error('Error fetching post from the database:', err);
      res.status(500).send('Internal Server Error');
      return;
    }

    const post = results[0];

    
    if (req.user.username !== post.username) {
      res.status(403).send('У вас не має дозволу на редагування цього допису');
      return;
    }

    res.render('edit-post', { post });
  });
});

router.post('/edit-post/:id', isAuthorized, (req, res) => {
  const postId = req.params.id;
  const { title, content } = req.body;

  db.query('UPDATE posts SET title = ?, content = ? WHERE id = ?', [title, content, postId], (err) => {
    if (err) {
      console.error('Error updating post in the database:', err);
      res.status(500).send('Internal Server Error');
      return;
    }

    res.redirect(`/post/${postId}`);
  });
});

router.get('/edit-topic/:id', isAuthorized, (req, res) => {
  const topicId = req.params.id;

  db.query('SELECT * FROM topics WHERE id = ?', topicId, (err, results) => {
    if (err) {
      console.error('Error fetching topic from the database:', err);
      res.status(500).send('Internal Server Error');
      return;
    }

    const topic = results[0];
    if (req.user.username !== topic.username) {
      res.status(403).send('У вас не має дозволу на редагування цієї теми');
      return;
    }
    res.render('edit-topic', { topic });
  });
});

router.post('/edit-topic/:id', isAuthorized, (req, res) => {
  const topicId = req.params.id;
  const { title, content } = req.body;

  db.query('UPDATE topics SET title = ?, content = ? WHERE id = ?', [title, content, topicId], (err) => {
    if (err) {
      console.error('Error updating topic in the database:', err);
      res.status(500).send('Internal Server Error');
      return;
    }

    res.redirect(`/topic/${topicId}`);
  });
});

module.exports = router;
