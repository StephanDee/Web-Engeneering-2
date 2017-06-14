/** This module defines the routes for pins using the store.js as db memory
 *
 * @author Johannes Konert
 * @contributor Nessi Durkaya, Stephan Dünkel, Julius
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
var store = require('../blackbox/store');
var codes = require('../restapi/http-codes'); // if you like, you can use this for status codes, e.g. res.status(codes.success);
var HttpError = require('../restapi/http-error.js');
var dateFormat = require("dateformat");
var pinsFilter = require("./pinsFilter.js");

var pins = express.Router();

const storeKey = 'pins';
var requiredKeys = {title: 'string', type: ['image', 'video', 'website'], src: 'string'};
var optionalKeys = {description: 'string', views: 'number', ranking: 'number'};
var internalKeys = {id: 'number', timestamp: 'number'};

/* GET all pins */
pins.route('/')
    .get(function (req, res, next) {
        res.locals.items = store.select('pins');
        res.locals.processed = true;
        logger("GET fetched store items");
        res.status(200);
        next();
    })
    .post(function (req, res, next) {
        var newObject = {};
        newObject.timestamp = new Date().getTime();
        newObject.description = "";
        var text = req.body.description;

        if (req.body.title != null) {
            newObject.title = req.body.title;
        }
        for (var i = 0; i < requiredKeys.type.length; i++) {
            if (requiredKeys.type[i] == req.body.type && req.body.type != null) {
                newObject.type = req.body.type;
            }
        }
        if (newObject.type == null) {
            var err = new HttpError('Type missing!', codes.wrongrequest);
            next(err);
            return;
        }
        if (req.body.src != null) {
            newObject.src = req.body.src;
        }
        if (req.body.description <= 0 || req.body.description >= 0) {
            var err = new HttpError('Number not allowed.', codes.wrongrequest);
            next(err);
            return;
        }
        else if (req.body.description == null) {
            newObject.description = "";
        } else
            newObject.description = text;

        if (req.body.views == null) {
            newObject.views = 0;
        }
        else if (req.body.views < 0) {
            var err = new HttpError('False Number.', codes.wrongrequest);
            next(err);
            return;
        }
        else newObject.views = req.body.views;
        if (req.body.ranking == null) {
            newObject.ranking = 0;
        }
        else if (req.body.ranking < 0) {
            var err = new HttpError('False Number.', codes.wrongrequest);
            next(err);
            return;
        } else newObject.ranking = req.body.ranking;

        var id = store.insert('pins', newObject);
        res.locals.items = store.select('pins', id);
        res.locals.processed = true;
        res.status(201);
        res.send(newObject);
        next();
        return;
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
        var id = req.params.id;
        res.locals.items = store.select('pins', id);
        res.locals.processed = true;
        next();
    })
    .delete(function (req, res, next) {
        var id = req.params.id;
        var object = store.select("pins", id);
        if (object == null) {
            var err = new HttpError('Object doesnt exist.', codes.notfound);
            next(err);
            return;
        }
        res.locals.items = store.remove('pins', id);
        res.locals.processed = true;
        res.status(204);
        next();
    })
    .put(function (req, res, next) {
        var id = req.params.id;
        if (id == undefined || id == null) {
            var err = new HttpError('Need Id in URL.', codes.wrongmethod);
            next(err);
            return;
        }
        if (store.select("pins", id) == null) {
            console.log("Error : id");
            var err = new HttpError('False Id in URL.', codes.wrongmethod);
            next(err);
            return;
        }
        var newObject = store.select("pins", id);
        newObject.timestamp = new Date().getTime() - 2 * 1000 * 60;
        for (var i = 0; i < requiredKeys.type.length; i++) {
            if (requiredKeys.type[i] == req.body.type && req.body.type != null) {
                newObject.type = req.body.type;
            }
            else if (req.body.title != null || req.body.src != null) {
                newObject.title = req.body.title;
                newObject.src = req.body.src;
            }
            else {
                console.log("Error : type");
                res.status(400);
                var err = new HttpError('Wrong Type!', codes.wrongrequest);
                next(err);
                return;
            }
        }
        if (req.body.description != undefined) {
            if (typeof req.body.description == "string") {
                newObject.description = req.body.description;
            } else {
                var err = new HttpError('Number not allowed:' + req.body.description, codes.wrongrequest);
                next(err);
                return;
            }
        }
        if (req.body.views == undefined) {
            newObject.views = 0;
        }
        else if (req.body.views < 0) {
            console.log("Error : views");
            var err = new HttpError('False Number.', codes.wrongrequest);
            next(err);
            return;
        }
        else   newObject.views = req.body.views;

        if (req.body.ranking == undefined) {
            newObject.ranking = 0;
        }
        else if (req.body.ranking < 0) {
            console.log("Error : views");
            var err = new HttpError('False Number.', codes.wrongrequest);
            next(err);
            return;
        }
        else newObject.ranking = req.body.ranking;

        res.locals.items = store.replace('pins', id, newObject);
        res.locals.processed = true;
        res.send(newObject);
        next();
        return;
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

pins.use(pinsFilter);

/**
 * This middleware would finally send any data that is in res.locals to the client (as JSON) or, if nothing left, will send a 204.
 */
pins.use(function (req, res, next) {
    if (res.locals.items) {
        res.json(res.locals.items);
        delete res.locals.items;
    } else if (res.locals.processed) {
        res.set('Content-Type', 'application/json');

        if (res.get('Status-Code') == 204) {
            res.status(204);
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
