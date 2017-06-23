/** This module defines a express.Router() instance
 * - checking Accept-Version header to be 1.0
 * - body-data to be JSON on POST/PUT/PATCH
 * - body to be not empty on POST/PUT/PATCH
 * - Request accepts JSOn as reply content-type
 *
 * @author Johannes Konert
 * @licence CC BY-SA 4.0
 *
 * @module restapi/request-checks
 * @type {Router}
 */

// remember: in modules you have 3 variables given by CommonJS
// 1.) require() function
// 2.) module.exports
// 3.) exports (which is module.exports)

var router = require('express').Router();

// API-Version control. We use HTTP Header field Accept-Version instead of URL-part /v1/
router.use(function(req, res, next){
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
router.use(function(req, res, next) {
    if (['POST', 'PUT', 'PATCH'].indexOf(req.method) > -1 &&
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


// request POST, PUT check that any content was send
router.use(function(req, res, next) {
    var err = undefined;
    if (['POST', 'PUT', 'PATCH'].indexOf(req.method) > -1 && parseInt(req.get('Content-Length')) === 0) {
        err = new Error("content in body is missing");
        err.status = 400;
        next(err);
    } else if ('PUT' === req.method && !(req.body.id || req.body._id)) {
        err = new Error("content in body is missing field id or _id");
        err.status = 400;
        next(err);
    }
    next();
});

module.exports = router;