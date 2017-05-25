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

var pins = express.Router();

const storeKey = 'pins';


// TODO if you like, you can use these objects for easy checking of required/optional and internalKeys....or remove it.
var requiredKeys = {title: 'string', type: ['image', 'video', 'website'], src: 'string'};
var optionalKeys = {description: 'string', views: 'number', ranking: 'number'};
var internalKeys = {id: 'number', timestamp: 'number'};


/* GET all pins */
pins.route('/')
    .get(function(req, res, next) {
        res.locals.items = store.select('pins');
        res.locals.processed = true;
        logger("GET fetched store items");
        next();
    })
    .post(function(req,res,next) {
        // TODO implement: req.body raus, nur Attribute für pins zulassen, nicht irgendwelche
        var id = store.insert('pins', req.body);
        res.locals.items = store.select('pins', id);
        res.locals.processed = true;

        // TODO Status 201 ?!
        //res.status(201).json(store.select('pins', res.locals.items));

        // TODO war vorher schon drin, kann eigentlich jetzt weg
        //var err = new HttpError('Unimplemented method!', codes.servererror);
        //next(err);
        next();
    })
    .all(function(req, res, next) {
        if (res.locals.processed) {
            next();
        } else {
            // reply with wrong method code 405
            var err = new HttpError('this method is not allowed at ' + req.originalUrl, codes.wrongmethod);
            next(err);
        }
    });


pins.route('/:id')
    .get(function(req, res, next) {
        // TODO implement: done
        var id = req.params.id;
        res.locals.items = store.select('pins', id);
        res.locals.processed = true;
        next();
    })
    .delete(function(req, res, next) {
        // TODO implement: almost done: res.status(200).end();?!
        var id = req.params.id;
        res.locals.items = store.remove('pins', id);
        res.locals.processed = true;
        next();
    })
    .put(function(req, res, next) {
        // TODO implement: almost done: res.status(200).end();?!: req.body austauschen... wie post oben
        var id = req.param.id;
        res.locals.items = store.replace('pins', id, req.body);
        res.locals.processed = true;
        next();
    })
    .all(function(req, res, next) {
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
pins.use(function(req, res, next){
    if (res.locals.items) {
        res.json(res.locals.items);
        delete res.locals.items;
    } else if (res.locals.processed) {
        res.set('Content-Type', 'application/json');
        if (res.get('Status-Code') == undefined) { // maybe other code has set a better status code before
            res.status(204); // no content;
        }
        res.end();
    } else {
        next(); // will result in a 404 from app.js
    }
});

module.exports = pins;
