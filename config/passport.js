const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const db = require('./database');

passport.use(new LocalStrategy(
  (username, password, done, res) => {
    db.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
      if (err) {
        console.error('Error authenticating user in the database:', err);
        return done(err);
        
      }

      if (results.length === 0) {
        
        return done(null, false, { message: 'User does not exist' });
      }

      const user = results[0];
      if (user.password !== password) {
        
        return done(null, false, { messege: 'Incorrect password' });
        
      }

      return done(null, user);
    });
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  db.query('SELECT * FROM users WHERE id = ?', id, (err, results) => {
    if (err) {
      return done(err);
    }
    const user = results[0];
    done(null, user);
  });
});

module.exports = passport;
