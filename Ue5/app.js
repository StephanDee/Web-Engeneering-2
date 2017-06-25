/** Main app for server to start a small REST API for videos
 *  STATUS: unfinished
 *
 * Note: set your environment variables
 * NODE_ENV=development
 * DEBUG=we2*
 *
 * @author Johannes Konert
 * @licence CC BY-SA 4.0
 *
 */
"use strict";

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var bodyParser = require('body-parser');
var debug = require('debug')('we2:server');
var morgan = require('morgan');

// own modules
var restAPIchecks = require('./restapi/request-checks');
var errorResponseWare = require('./restapi/error-response');
var HttpError = require('./restapi/http-error');

var pins = require('./routes/pins');

// add mongodb
var mongoose = require('mongoose');
// resolves warning 'mpromise depricated'
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/we2');
// ('mongodb://localhost:27017/we2', function(err) { if (err) console.log(err); } );


// app creation
var app = express();

// Middlewares *************************************************
app.use(favicon(path.join(__dirname, 'public', 'images/faviconbeuth.ico')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

// logging
app.use(morgan('dev'));

// API request checks for API-version and JSON etc.
app.use(restAPIchecks);


// Routes ******************************************************
app.use('/pins', pins);






// (from express-generator boilerplate  standard code)
// Errorhandling and requests without proper URLs ************************
// catch 404 and forward to error handler
app.use(function(req, res, next) {
    debug('Catching unmatched request to answer with 404');
    var err = new HttpError('Not Found', 404);
    next(err);
});

// register error handlers
errorResponseWare(app);

// Start server ****************************
app.listen(3000, function(err) {
    if (err !== undefined) {
        debug('Error on startup, ',err);
    }
    else {
        debug('Listening on port 3000');
    }
});