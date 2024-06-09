const express = require('express');
const router = express.Router();
const db = require('../config/database');


function isAuthorized(req, res, next) {
  if (req.user) {
    next(); 
  } else {
    res.status(401).send('Ви не авторизовані');
  }
}

router.post('/delete-topic/:id', isAuthorized, (req, res) => {
  const topicId = req.params.id;
  db.query('SELECT username FROM topics WHERE id = ?', topicId, (err, results) => {
    if (err) {
      console.error('Error fetching topic details from the database:', err);
      res.status(500).send('Internal Server Error');
      return;}
    if (results.length === 0) {
      res.status(404).send('Topic not found');
      return;}
    const topicUsername = results[0].username;
    const username = req.session.user.username;
    if (username !== topicUsername) {
      console.log('Permission Denied');
      res.status(403).send('У вас не має дозволу на видалення цієї теми');
      return;}
    db.query('DELETE FROM comments WHERE post_id IN (SELECT id FROM posts WHERE topic_id = ?)', topicId, (err) => {
      if (err) {
        console.error('Error deleting comments from the database:', err);
        res.status(500).send('Internal Server Error');
        return;}
      db.query('DELETE FROM posts WHERE topic_id = ?', topicId, (err) => {
        if (err) {
          console.error('Error deleting posts from the database:', err);
          res.status(500).send('Internal Server Error');
          return;}
        db.query('DELETE FROM topics WHERE id = ?', topicId, (err) => {
          if (err) {
            console.error('Error deleting topic from the database:', err);
            res.status(500).send('Internal Server Error');
            return;}
          res.redirect('/');
        });
      });
    });
  });
});



router.post('/delete-post/:id', isAuthorized, (req, res) => {
  const postId = req.params.id;
  db.query('SELECT username FROM posts WHERE id = ?', postId, (err, results) => {
    if (err) {
      console.error('Error fetching post details from the database:', err);
      res.status(500).send('Internal Server Error');
      return;
    }
    if (results.length === 0) {
      res.status(404).send('Post not found');
      return;
    }
    const postUsername = results[0].username;
    if (req.user.username !== postUsername) {
      res.status(403).send('У вас не має дозволу на видалення цього допису');
      return;
    }
    db.query('DELETE FROM comments WHERE post_id = ?', postId, (err) => {
      if (err) {
        console.error('Error deleting comments from the database:', err);
        res.status(500).send('Internal Server Error');
        return;
      }
      db.query('DELETE FROM posts WHERE id = ?', postId, (err) => {
        if (err) {
          console.error('Error deleting post from the database:', err);
          res.status(500).send('Internal Server Error');
          return;
        }
        res.redirect('/');
      });
    });
  });
});

router.post('/delete-comment/:id', isAuthorized, (req, res) => {
  const commentId = req.params.id;
  if (!req.user) {
    res.status(401).send('You are not authorized');
    return;
  }
  db.query('SELECT username FROM comments WHERE id = ?', commentId, (err, results) => {
    if (err) {
      console.error('Error fetching comment details from the database:', err);
      res.status(500).send('Internal Server Error');
      return;
    }
    if (results.length === 0) {
      res.status(404).send('Comment not found');
      return;
    }
    const commentUsername = results[0].username;
    if (req.user.username !== commentUsername) {
      res.status(403).send('У вас не має дозволу на видалення цього коментаря');
      return;
    }
    db.query('DELETE FROM comments WHERE id = ?', commentId, (err) => {
      if (err) {
        console.error('Error deleting comment from the database:', err);
        res.status(500).send('Internal Server Error');
        return;
      }
      res.redirect('/');
    });
  });
});

module.exports = router;
