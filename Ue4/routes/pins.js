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
var bodyParser = require('body-parser');
var dateFormat = require("dateformat");

var pins = express.Router();

const storeKey = 'pins';


// TODO if you like, you can use these objects for easy checking of required/optional and internalKeys....or remove it.
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
        newObject.timestamp = dateFormat(res.systemDate, "yyyy-mm-dd");
        newObject.description = "";
        var text = req.body.description;

        if (req.body.type == null) {
            res.status(400);
        }
        for (var i = 0; i < requiredKeys.type.length; i++) {
            if (requiredKeys.type[i] == req.body.type) {
                newObject.type = [req.body.type];
            }
        }
        if (req.body.title != null || req.body.src != null) {
            newObject.title = req.body.title;
            newObject.src = req.body.src;
        }
        if (req.body.description <= 0 || req.body.description >= 0 || req.body.description==null) {
            newObject.description = " ";
        } else
            newObject.description = text;

        if (req.body.views == null || req.body.views < 0) {
            newObject.views = 0;
        } else
            newObject.views = req.body.views;
        if (req.body.ranking == null || req.body.ranking < 0) {
            newObject.ranking = 0;
        } else
            newObject.ranking = req.body.ranking;
        var id = store.insert('pins', newObject);
        res.locals.items = store.select('pins', id);
        res.locals.processed = true;
        next();
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
        // TODO implement: done
        var id = req.params.id;
        res.locals.items = store.select('pins', id);
        res.locals.processed = true;
        res.status(200);
        next();
    })
    .delete(function (req, res, next) {
        // TODO implement: almost done: res.status(200).end();?!
        var id = req.params.id;
        res.locals.items = store.remove('pins', id);
        res.locals.processed = true;
        res.status(204);
        next();
    })
    .put(function (req, res, next) {
        var id = req.params.id;
        var newObject = {};
        for (var i = 0; i < requiredKeys.type.length; i++) {

            if (requiredKeys.type[i] == req.body.type && req.body.type != null) {
                newObject.type = [req.body.type];
            }
            else if (req.body.title != null || req.body.src != null) {
                newObject.title = req.body.title;
                newObject.src = req.body.src;
            }
            else {
                res.status(400);
                var err = new HttpError('Wrong Type!', codes.wrongrequest);
                next(err);
            }
        }
        if (req.body.description <= 0 || req.body.description >= 0) {
            newObject.description = " ";
        } else
            newObject.description = req.body.description;

        if (req.body.views == null || req.body.views < 0) {
            newObject.views = 0;
        } else   newObject.views = req.body.views;
        if (req.body.ranking == null || req.body.ranking < 0) {
            newObject.ranking = 0;
        } else
            newObject.ranking = req.body.ranking;
        store.replace('pins', id, newObject);
        res.locals.items = newObject;
        res.locals.processed = true;
        next();
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
 * This middleware would finally send any data that is in res.locals to the client (as JSON) or, if nothing left, will send a 204.
 */
pins.use(function (req, res, next) {
    if (res.locals.items) {
        res.json(res.locals.items);
        delete res.locals.items;
    } else if (res.locals.processed) {
        res.set('Content-Type', 'application/json');
        if (res.get('Status-Code') == created) { // maybe other code has set a better status code before
            res.status(201); // no content;
        }
        if (res.get('Status-Code') == nocontent) { // maybe other code has set a better status code before
            res.status(204); // no content;
        }
        if (res.get('Status-Code') == wrongrequest) { // maybe other code has set a better status code before
            res.status(400); // no content;
        }
        if (res.get('Status-Code') == wrongdatatyperequest) { // maybe other code has set a better status code before
            res.status(406); // no content;
        }
        if (res.get('Status-Code') == wrongmediasend) { // maybe other code has set a better status code before
            res.status(415); // no content;
        }
        res.end();
    } else {
        next(); // will result in a 404 from app.js
    }
});

module.exports = pins;
