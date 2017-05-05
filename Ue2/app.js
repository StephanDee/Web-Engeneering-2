"use strict";
var express = require('express');
var path = require('path');

var app = express();

// add route to static files
app.use('/staticfiles', express.static(path.join(__dirname, 'public')));

// start server
var server = app.listen(3000, function () {
console.log('App is ready and listening at http://localhost:3000/staticfiles');
});