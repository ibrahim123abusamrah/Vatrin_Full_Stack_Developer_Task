var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var morgan = require('morgan');
var Knex = require('knex');
var bodyParser = require('body-parser');
var knexConfig = require('./DatabaseCon');
var Model = require('objection').Model;
var indexRouter = require('./routes/API');
var usersRouter = require('./routes/users');
const session = require('express-session')
const cors = require('cors')
const flash = require('connect-flash');

var knex = Knex(knexConfig.development);

Model.knex(knex);

var app = express()
  .use(bodyParser.json())
  .use(morgan('dev'))
  .set('json spaces', 2);

// view engine setup
app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(flash());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
// Setup public directory
app.use(express.static(path.join(__dirname, 'public')));
let sessionHandler = session({
  secret: 'none',
  rolling: true,
  resave: true,
  saveUninitialized: true
});

app.use(sessionHandler);
app.use(cors());
app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// Error handling. The `ValidionError` instances thrown by objection.js have a `statusCode`
// property that is sent as the status code of the response.
app.use(function (err, req, res, next) {
  if (err) {
    res.status(err.statusCode || err.status || 500).send(err.data || err.message || {});
  } else {
    next();
  }
});

module.exports = app;
