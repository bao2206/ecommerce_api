var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');

var app = express();
const mongoose = require('mongoose');
const ConnectDB = require("./src/database/init_database")
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// ConnectDB;

app.use('/',  require('./src/routes'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
 const statusCode = err.status || 500;
//  console.log("23243")
 return res.status(statusCode).json({
  status : 'Error',
  code: statusCode,
  message: err.message || 'Internal Server Error'
})
});

module.exports = app;
