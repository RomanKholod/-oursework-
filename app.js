const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const flash = require('express-flash');
const cookieParser = require('cookie-parser');
const LocalStrategy = require('passport-local').Strategy;

const app = express();
const port = 8000;


app.set('view engine', 'ejs');

const db = require('./config/database');


app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(session({ secret: 'secret', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(bodyParser.json());

const authRoutes = require('./routes/authRoutes');
app.use('/', authRoutes);
const deleteRoutes = require('./routes/deleteRoutes');
app.use('/', deleteRoutes);
const userRoutes = require('./routes/userRoutes');
app.use('/', userRoutes);

const topicRoutes = require('./routes/topicRoutes');
app.use('/topic', topicRoutes);

const postRoutes = require('./routes/postRoutes');
app.use('/post', postRoutes);

const commentRoutes = require('./routes/commentRoutes');
app.use('/', commentRoutes);

const editRoutes = require('./routes/editRoutes');
app.use('/', editRoutes);


app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
