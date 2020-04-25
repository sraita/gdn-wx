var express = require('express');

var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var timeout = require('connect-timeout'); //express v4

// global CONFIG
global.CONFIG = require('./config');
console.log(CONFIG.JWT_SECRET);

// 微信 AccessToken 全局缓存
global.wx = {
  accessToken: null,
  accessTokenExpireAt: Date.now()
}

var indexRouter = require('./routes/index');
const userRouter = require('./routes/user');
const menuRouter = require('./routes/menu');
const roleRouter = require('./routes/role');
const routeRouter = require('./routes/route');
const teamRouter = require('./routes/team');
const orderRouter = require('./routes/order');
const sysRouter = require('./routes/system');

require('./db');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// Middlewares
function haltOnTimedout(req, res, next) {
  if (!req.timedout) next();
}
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use(timeout(1200000));
app.use(haltOnTimedout);
// Routes
app.use('/', indexRouter);
app.use('/api/users', userRouter);
app.use('/api/menus', menuRouter);
app.use('/api/roles', roleRouter);
app.use('/api/routes',routeRouter);
app.use('/api/teams', teamRouter);
app.use('/api/orders', orderRouter);
app.use('/api/sys', sysRouter);


// Catch 404 and forward them to error handler
app.use(function (req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Error handler function
app.use(function (err, req, res, next) {
  const error = app.get('env') === 'development' ? err : {};
  const status = err.status || 500;
  // Respond to client
  res.status(status).json({
    status: 'error',
    name: error.name,
    message: error.message
  })
  // Respond to ourselves
  
  console.error(err);
});

process.on('unhandledRejection', (err) => {
  console.log('Unhandled Rejection at:', err.name, 'message:', err.message);
  console.log('stack', err.stack)
  // application specific logging, throwing an error, or other logic here
  
});


module.exports = app;
