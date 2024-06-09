const express = require('express');
const router = express.Router();
const db = require('../config/database');



router.get('/:id', (req, res) => {
    const topicId = req.params.id;
  
    db.query('SELECT * FROM topics WHERE id = ?', topicId, (err, postResults) => {
      if (err) {
        console.error('Error fetching post from the database:', err);
        res.status(500).send('Internal Server Error');
        return;
      }
  
      db.query('SELECT * FROM posts WHERE topic_id = ?', topicId, (err, commentResults) => {
        if (err) {
          console.error('Error fetching comments from the database:', err);
          res.status(500).send('Internal Server Error');
          return;
        }
  
        res.render('topic', { topic: postResults[0], posts: commentResults });
      });
    });
  });
  
  

module.exports = router;
