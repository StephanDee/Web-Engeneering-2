/** This module defines the routes for pins using the store.js as db memory
 *
 * @author Johannes Konert
 * @contributor Nessi, Julius, Stephan
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

// add here your require for your own model file
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
        // not used for this solution
        // req.body.timestamp = new Date().getTime();

        // store.insert - mongoose
        var pin = new Pin(req.body);
        pin.save(function (err) {
            // solution from SU 08 page 74
            //     if(!err){
            //         res.status(201).json(pin);
            //     } else {
            //         err.status = 400;
            //         err.message += 'in fields: '
            //     }
            //     next(err);
            // });
            if (err) {
                err.status = codes.wrongrequest;
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
        // store.select with mongoose - mongodb
        var id = req.params.id;
        Pin.findById(id, function (err, items) {
            res.json(items);
        });
        // old solution with store.js
        // res.locals.items = store.select(storeKey, req.params.id);
        res.locals.processed = true;
        //Remove this next(), this causes next middleware to be executed.
        // next();
    })
    .put(function (req, res, next) {
        // TODO store.update with mongoose - mongodb
        var id = req.params.id;
        Pin.findById(id, function (err, pin) {
            if (err) {
                err.status = codes.notfound;
                res.status(err.status).json({
                    'error': {
                        'message': 'No element found with id: ' + req.params.id,
                        'code': codes.notfound
                    }
                });
                return;
            }

            pin.save(function (err) {
                if (err) {
                    err.status = codes.wrongrequest;
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
                res.status(200).json(pin);
            });
        });
        // old solution with store.js
        // store.replace(storeKey, req.body.id, req.body);
        // old solution with store.js
        // res.locals.items = store.select(storeKey, id);
        res.locals.processed = true;
        //Remove this next(), this causes next middleware to be executed.
        // next();
    })
    .delete(function (req, res, next) {
        // store.remove with mongoose - mongodb
        var id = req.params.id;
        Pin.findByIdAndRemove(id, function (err, pin) {
            if (err) {
                err.status = codes.notfound;
                res.status(err.status).json({
                    'error': {
                        'message': 'No element to delete with id: ' + req.params.id,
                        'code': codes.notfound
                    }
                });
            } else {
                res.status(200).end();
            }
        });
        // old solution with store.js
        // store.remove(storeKey, id);
        // ...
        //    var err = new HttpError('No element to delete with id ' + req.params.id, codes.notfound);
        //    next(err);
        // ...
        res.locals.processed = true;
        //Remove this next(), this causes next middleware to be executed.
        // next();
    })
    .patch(function (req, res, next) {
        // store.patch with mongoose - mongoDB
        var id = req.params.id;
        Pin.findByIdAndUpdate(id, req.body, {runValidators: true, new: true}, function (err, pin) {
            if (err) {
                err.status = codes.wrongrequest;
                res.status(err.status).json({
                    'error': {
                        'message': err.message,
                        'code': codes.wrongrequest
                    }
                });
                return;
            }
            res.status(200).json(pin);
        });
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
        if (res.get('Status-Code') == undefined || res.get('Status-Code') == 204) { // maybe other code has set a better status code before
            res.status(204); // no content;
        }
        if (res.get('Status-Code') == 201) {
            res.status(201);
        }
        if (res.get('Status-Code') == 400) {
            res.status(400);
        }
        if (res.get('Status-Code') == 405) {
            res.status(405);
        }
        if (res.get('Status-Code') == 404) {
            res.status(404);
        }
        if (res.get('Status-Code') == 409) {
            res.status(409);
        }
        if (res.get('Status-Code') == 415) {
            res.status(415);
        }
        res.end();
    } else {
        next(); // will result in a 404 from app.js
    }
});

module.exports = pins;