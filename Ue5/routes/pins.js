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
            // if (err) {
            //     err.status = codes.wrongrequest;
            //     res.status(err.status).json({
            //         'error': {
            //             'message': err.message + ' in fields: '
            //             + Object.getOwnPropertyNames(err.errors),
            //             'code': codes.wrongrequest
            //         }
            //     });
            //     return;
            // } else {
            // Filter

            // Filter
            if (req.query.filter != undefined) {
                var values = req.query.filter.split(",");
                Pin.find({}, values, function (err, items) {
                    // Success
                    res.status(200);
                    res.locals.items = items;
                    res.locals.processed = true;
                    next();
                });
            }
            // Success
            res.status(200);
            res.locals.items = items;
            res.locals.processed = true;
            logger("GET fetched items");
            next();
            // }
        });
    })
    .post(function (req, res, next) {
        // not used for this solution
        // req.body.timestamp = new Date().getTime();

        // store.insert - mongoose
        var pin = new Pin(req.body);
        pin.save(function (err) {
            if (err) {
                // Error - 400
                err.status = codes.wrongrequest;
                res.status(err.status).json({
                    'error': {
                        'message': err.message + ' in fields: '
                        + Object.getOwnPropertyNames(err.errors),
                        'code': codes.wrongrequest
                    }
                });
                return;
            }
            // Created
            res.status(201);
            res.locals.items = pin;
            res.locals.processed = true;
            next();
        });
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
        Pin.findById(id, function (err, item) {
            if (err) {
                // Error - not found
                err.status = 404;
                res.status(err.status).json({
                    'error': {
                        'message': 'No element found with id: ' + id,
                        'code': codes.notfound
                    }
                });
                return;
            }
            // Filter
            if (req.query.filter != undefined) {
                var values = req.query.filter.split(",");
                Pin.find({}, values, function (err, items) {
                    // Success
                    res.status(200);
                    res.locals.items = items;
                    res.locals.processed = true;
                    next();
                });
            }
            // success
            res.status(200);
            res.locals.items = item;
            res.locals.processed = true;
            next();
        });
    })
    .put(function (req, res, next) {
        // store.update with mongoose - mongodb
        var pin = new Pin(req.body);
        var id = req.params.id;

        // Check id
        if (pin._id != id) {
            //Error 400
            var err = new HttpError('No element found with id: ' + id, codes.notfound);
            next(err);
            return;
        }

        // Check requierd values
        if (pin.title === undefined) {
            var err = new HttpError('Title is required.', codes.wrongrequest);
            next(err);
            return;
        }
        if (pin.type === undefined) {
            var err = new HttpError('Type is required', codes.wrongrequest);
            next(err);
            return;
        }
        if (pin.src === undefined) {
            var err = new HttpError('Src is required.', codes.wrongrequest);
            next(err);
            return;
        }
        if (pin.type !== 'image' && pin.type !== 'video' && pin.type !== 'website') {
            var err = new HttpError('Type must be image, video or website.', codes.wrongrequest);
            next(err);
            return;
        }

        // Check value datatype
        var views = parseInt(pin.views);
        var ranking = parseInt(pin.ranking);
        // NaN = not a number
        if (views < 0 || ranking < 0 || views === NaN || ranking === NaN) {
            //ERROR 400
            var err = new HttpError('Ranking or views must be positive numbers.', codes.wrongrequest);
            next(err);
            return;
        }

        // Set Default if undefined
        if (pin.description === undefined) {
            pin.description = "";
        }
        if (pin.views === undefined) {
            pin.views = 0;
        }
        if (pin.ranking === undefined) {
            pin.ranking = 0;
        }

        Pin.findByIdAndUpdate(id, pin, {new: true}, function (err, item) {
            if (err) {
                // Error - not found
                err.status = 404;
                res.status(err.status).json({
                    'error': {
                        'message': 'No element found with id: ' + id,
                        'code': codes.notfound
                    }
                });
                return;
            }
            // Success
            res.status(200);
            res.locals.items = item;
            res.locals.processed = true;
            next();
        });
    })
    .delete(function (req, res, next) {
        // store.remove with mongoose - mongodb
        var id = req.params.id;
        Pin.findByIdAndRemove(id, function (err) {
            if (err) {
                // Error 404
                err.status = codes.notfound;
                res.status(err.status).json({
                    'error': {
                        'message': 'No element found to delete with id: ' + id,
                        'code': codes.notfound
                    }
                });
            } else {
                // Success
                res.status(200);
                res.locals.processed = true;
                next();
            }
        });
    })
    .patch(function (req, res, next) {
        // store.patch with mongoose - mongoDB
        var id = req.params.id;
        var body = req.body;
        Pin.findByIdAndUpdate(id, body, {runValidators: true, new: true}, function (err, item) {
            if (err) {
                // Error 400
                err.status = codes.wrongrequest;
                res.status(err.status).json({
                    'error': {
                        'message': err.message,
                        'code': codes.wrongrequest
                    }
                });
                return;
            }
            // Success
            res.status(200);
            res.locals.items = item;
            res.locals.processed = true;
            next();
        });
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