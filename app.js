var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var routes = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



//db connection
var uri = process.env.MONGODB_URI
if (!uri) {
  console.error( Date() + " MONGODB_URI environment variable is not set: EXITING" );
  process.exit(101);
}
mongoose.connect(uri);

var db = mongoose.connection;
db.on('error', function callback () {
  console.error( Date() + "Error connecting with Database : EXITING" );
  process.exit(100);
});
db.once('open', function callback () {
  console.log(Date() + " Connected to Database" );
});


//our custom libraries
global.__basedir = __dirname + '/';
global.__schemas = __dirname + '/schemas/';
rootdir=__dirname; // Important setting which shares the apps root directory to all the files.Based on this setting all other files are called and used.

var track = require("./events/track/track")

//custom middlewares
app.get('*', function(req, res, next){
  track.emit('addReqCount', req.hostname, req.ip);
  next()
})

app.use('/', routes);
// app.use('/users', users);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
