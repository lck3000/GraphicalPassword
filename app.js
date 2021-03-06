require('dotenv').config();

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

// Session
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json({limit: '10mb'}));
app.use(express.urlencoded({ extended: false, limit: '10mb'}));
app.use(cookieParser());
app.use(session({
  secret: 'supersecretseguridadinformatica',
  resave: true,
  saveUninitialized: true,
  store: new MongoStore({mongooseConnection: require('./database/mongo')})
}));

app.use(express.static(path.join(__dirname, 'public')));


app.use('/register', require('./routes/register'));
app.use('/login', require('./routes/login'));
app.use('/', require('./routes/index'));


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  console.log(err.message);

  res.locals.message = err.message;
  res.locals.error = process.env.APP_ENV === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
