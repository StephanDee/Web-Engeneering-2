/** This module defines the routes for pins using the store.js as db memory
 *
 * @author Johannes Konert
 * @licence CC BY-SA 4.0
 *
 * @module routes/pins
 * @type {Router}
 */

// remember: in modules you have 3 variables given by CommonJS
// 1.) require() function
// 2.) module.exports
// 3.) exports (which is module.exports)

// modules
var express = require('express');
var logger = require('debug')('we2:pins');
var codes = require('../restapi/http-codes');
var HttpError = require('../restapi/http-error.js');

// TODO add here your require for your own model file
// var mongoose = require('mongoose');
// mongoose.connect('mongodb://localhost/27017/we2');

var Pin = require('../models/pin.js');

var pins = express.Router();

var storeKey = 'pins';

// routes **************
pins.route('/')
    .get(function (req, res, next) {

        // store.select with mongoose - mongodb
        Pin.find({}, function (err, items) {
            res.json(items);
        });

        // old solution with store.js
        // res.locals.items = store.select(storeKey);

        res.locals.processed = true;
        logger("GET fetched items");

        //Remove this next(), this causes next middleware to be executed.
        //next();
    })
    .post(function (req, res, next) {
        req.body.timestamp = new Date().getTime();

        // store.insert - mongoose
        var pin = new Pin(req.body);
        pin.save(function (err) {
            if (err) {
                err.status = 400;
                res.status(err.status).json({
                    'error': {
                        'message': err.message,
                        'code': codes.wrongrequest
                    }
                });

                return;

                // other solution, but without 'code'
                // save - can be deleted afterwards
                // err.message += ' in fields: '
                //     + Object.getOwnPropertyNames(err.errors);

                // Remove this next(), this causes next middleware to be executed.
                // return next(err);
            }
            res.status(201).json(pin);
        });

        // old solution with store.js
        // var id = store.insert(storeKey, req.body);


        // res.status(codes.created);

        // old solution with store.js
        // res.locals.items = store.select(storeKey, id);
        res.locals.processed = true;

        //Remove this next(), this causes next middleware to be executed.
        //next();
    })
    .all(function (req, res, next) {
        if (res.locals.processed) {
            next();
        } else {
            // reply with wrong method code 405
            var err = new HttpError('this method is not allowed at ' + req.originalUrl, codes.wrongmethod);
            next(err);
        }
    });

pins.route('/:id')
    .get(function (req, res, next) {

        // TODO replace store and use mongoose/MongoDB
        Pin.findById(req.params.id, function (err, items) {
            res.json(items);
        });
        // res.locals.items = store.select(storeKey, req.params.id);
        res.locals.processed = true;

        //Remove this next(), this causes next middleware to be executed.
        // next();
    })
    .put(function (req, res, next) {
        // TODO replace store and use mongoose/MongoDB
        // store.replace(storeKey, req.body.id, req.body);
        res.status(codes.success);
        // res.locals.items = store.select(storeKey, id);
        res.locals.processed = true;
        next();
    })
    .delete(function (req, res, next) {
        // TODO replace store and use mongoose/MongoDB
        // store.remove(storeKey, id);

        // ...
        //    var err = new HttpError('No element to delete with id ' + req.params.id, codes.notfound);
        //    next(err);
        // ...
        res.locals.processed = true;
        next();
    })
    .patch(function (req, res, next) {

        // TODO replace these lines by correct code with mongoose/mongoDB
        var err = new HttpError('Unimplemented method!', codes.servererror);
        next(err);
    })

    .all(function (req, res, next) {
        if (res.locals.processed) {
            next();
        } else {
            // reply with wrong method code 405
            var err = new HttpError('this method is not allowed at ' + req.originalUrl, codes.wrongmethod);
            next(err);
        }
    });

/**
 * This middleware would finally send any data that is in res.locals to the client (as JSON)
 * or, if nothing left, will send a 204.
 */
pins.use(function (req, res, next) {
    if (res.locals.items) {
        res.json(res.locals.items);
        delete res.locals.items;
    } else if (res.locals.processed) {
        res.set('Content-Type', 'application/json'); // not really necessary if "no content"
        if (res.get('Status-Code') == undefined) { // maybe other code has set a better status code before
            res.status(204); // no content;
        }
        res.end();
    } else {
        next(); // will result in a 404 from app.js
    }
});

module.exports = pins;
