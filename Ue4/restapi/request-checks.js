
var router = require('express').Router();

router.use(function(req, res, next){
    var versionWanted = req.get('Accept-Version');
    if (versionWanted !== undefined && versionWanted !== '1.0') {
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
    }
    
    else if ('PUT' === req.method && !(req.body.id || req.body._id)) {
        err = new Error("content in body is missing field id or _id");
        err.status = 400;
        next(err);
    }
    var setTitleHref = function(item) {
        item.title = {
            href: req.protocol + '://' + req.get('host') + req.baseUrl +'/'+ item.id + '/title'
        };

        if (req.query.filter === "title") {
           // req.query.filter.split(","); foreach

            var title = getTitleObject(item.id);
          //  var keepOldHref = item.tweets.href;
            if (title) {
                item.title = "thbjiko";
               // item.title.href = keepOldHref; // set back to correct value inside of /user/:id
            }
        }
    };
    var toSend = res.locals.item;
    if (toSend) {
        if (!Array.isArray(toSend)) {
            setTitleHref(toSend);
        } else {
            toSend.forEach(setTitleHref);
        }
    }
    next();
});

var getTitleObject = function getTitleObject(userId) {
    var regExp = undefined;
    var allPins = store.select("pins");
    
    if (!allPins || allPins.length == 0) {
        return undefined;
    }
    
    allPins = allPins.filter(function(element) {
        regExp = new RegExp('pins/'+userId);
        return (element && element.creator && regExp.test(element.creator.href));
    });
    
    if (!allPins || allPins.length == 0) {
        return undefined;
    }
    return allPins; // the found tweets
};

module.exports = router;