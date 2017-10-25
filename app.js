const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const MongoClient = require('mongodb').MongoClient;
const serverEnv = require('./serverEnv');

const index = require('./routes/index');
const users = require('./routes/users');
const api = require('./routes/api');
const user = require('./routes/apis/user');
const leaves = require('./routes/apis/leaves');
const request = require('./routes/apis/request');
const approval = require('./routes/apis/approval');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.all('*', (req, res, next) => {
  async function setDb () {
	  let db = await MongoClient.connect(`${serverEnv.mongoHost}:${serverEnv.mongoPort}/${serverEnv.dbInfo.dbName}`);
	  console.log('Connected correctly to server ==== root');
	  req.db = db;
	  next()
  }
  setDb();
});
app.use('/', index);
app.use('/users', users);
app.use('/api', api);
app.use('/api/user', user);
app.use('/api/leaves', leaves);
app.use('/api/request', request);
app.use('/api/approval', approval);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
