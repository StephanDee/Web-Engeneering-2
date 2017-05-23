/** Main app for server to start a small REST API for tweets
 * The included ./blackbox/store.js gives you access to a "database" which contains
 * already tweets with id 101 and 102, as well as users with id 103 and 104.
 * On each restart the db will be reset (it is only in memory).
 * Best start with GET http://localhost:3000/tweets to see the JSON for it
 *
 * @contributor Nessi Durkaya, Stephan Dünkel, Julius
 */
"use strict";  // tell node.js to be more "strict" in JavaScript parsing (e.g. not allow variables without var before)

// node module imports
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');

// our own modules imports
var store = require('./blackbox/store.js');

// creating the server application
var app = express();

// Middleware ************************************
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// logging
app.use(function (req, res, next) {
    console.log('Request of type ' + req.method + ' to URL ' + req.originalUrl);
    next();
});

// API-Version control. We use HTTP Header field Accept-Version instead of URL-part /v1/
app.use(function (req, res, next) {
    // expect the Accept-Version header to be NOT set or being 1.0
    var versionWanted = req.get('Accept-Version');
    if (versionWanted !== undefined && versionWanted !== '1.0') {
        // 406 Accept-* header cannot be fulfilled.
        res.status(406).send('Accept-Version cannot be fulfilled').end();
    } else {
        next(); // all OK, call next handler
    }
});

// request type application/json check
app.use(function (req, res, next) {
    if (['POST', 'PUT'].indexOf(req.method) > -1 &&
        !( /application\/json/.test(req.get('Content-Type')) )) {
        // send error code 415: unsupported media type
        res.status(415).send('wrong Content-Type');  // user has SEND the wrong type
    } else if (!req.accepts('json')) {
        // send 406 that response will be application/json and request does not support it by now as answer
        // user has REQUESTED the wrong type
        res.status(406).send('response of application/json only supported, please accept this');
    }
    else {
        next(); // let this request pass through as it is OK
    }
});


// Routes ***************************************

app.get('/tweets', function (req, res, next) {
    var tweetObject = store.select('tweets');
    for (var i = 0; i < tweetObject.length; i++) {
        var id = tweetObject[i].id;
        tweetObject[i].places = {href: req.get('host') + "/tweets/" + id + "/places"};
    }
    res.json(tweetObject);
});

app.post('/tweets', function (req, res, next) {
    var id = store.insert('tweets', req.body);
    res.status(201).json(store.select('tweets', id));
});

app.get('/tweets/:id', function (req, res, next) {
    res.json(store.select('tweets', req.params.id));
});

app.delete('/tweets/:id', function (req, res, next) {
    store.remove('tweets', req.params.id);
    res.status(200).end();
});

app.put('/tweets/:id', function (req, res, next) {
    store.replaces('tweets', req.params.id, req.body);
    res.status(200).end();
});

// new Routes for places ************************

// Task 1.a
app.get('/places', function (req, res, next) {
    var outerObject = {href: req.get('host') + "/places"};
    var placeObject = store.select('places');
    for (var i = 0; i < placeObject.length; i++) {
        placeObject[i].href = req.get('host') + "/places/" + placeObject[i].id;
        placeObject[i].tweets = {href: req.get('host') + "/places/" + placeObject[i].id + "/tweets"};
    }
    outerObject.items = placeObject;
    res.json(outerObject);
});
// Task 1.b

//Extra Task 3.2
/**
 * Method to find tweets.
 * 
 * @param place id to find the tweets
 * @returns {Array} with all the Tweets that belong to the place
 */
function findTweet(id) {
    var tweets = store.select('tweets');
    var tweetArray = [];
    for (var i = 0; i < tweets.length; i++) {
        if (tweets[i].places.id == id) {
            tweetArray = tweets[i];
        }
    }
    return tweetArray;
}
app.get('/places/:expand=tweets', function (req, res, next) {
    var outerObject = {href: req.get('host') + "/places/?expand=tweets"};
    var placeObject = store.select('places');
    var items = [];
    for (var x = 0; x < placeObject.length; x++) {
        var id = placeObject[x].id;
        items = findTweet(id);
        if (items != null) {
            placeObject[x] = {
                id: id, name: placeObject[x].name, href: req.get('host') + "/places/" + id + "/tweets"
            };
            placeObject[x].tweets = items;
        }
    }
    outerObject.items = placeObject;
    res.json(outerObject);
});

app.get('/places/:id', function (req, res, next) {
    var id = req.params.id;
    var placeObject = store.select('places', id);
    placeObject.href = req.get('host') + "/places/" + placeObject.id;
    placeObject.tweets = {href: req.get('host') + "/places/" + id + "/tweets"};
    res.json(placeObject);
});

app.post('/places', function (req, res, next) {
    var id = store.insert('places', req.body);
    var Object = store.select('places', id);
    Object.tweets = {href: req.get('host') + "/places/" + id + "/tweets"};
    Object.href = req.get('host') + "/places/" + id;
    res.status(201).json(Object);
});

app.delete('/places/:id', function (req, res, next) {
    store.remove('places', req.params.id);
    res.status(200).end();
});

app.put('/places/:id', function (req, res, next) {
    store.replaces('places', req.params.id, req.body);
    res.status(200).end();
});


// catch 404 and forward to error handler

app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers (express recognizes it by 4 parameters!)

// development error handler
// will print stacktrace as JSON response
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        console.log('Internal Error: ', err.stack);
        res.status(err.status || 500);
        res.json({
            error: {
                message: err.message,
                error: err.stack
            }
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.json({
        error: {
            message: err.message,
            error: {}
        }
    });
});

// Start server ****************************
app.listen(3000, function (err) {
    if (err !== undefined) {
        console.log('Error on startup, ', err);
    }
    else {
        console.log('Listening on port 3000');
    }
});