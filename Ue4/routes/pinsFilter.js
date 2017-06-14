var router = require('express').Router();

router.use(function (req, res, next) {

    var toSend = res.locals.items;
    if (toSend) {
        if (!Array.isArray(toSend)) {
            res.locals.items = setItems(toSend);
        } else {
            if (req.query.filter == undefined) {
                next();
                return;
            }
            res.locals.items = [];
            toSend.forEach(function (item) {
                res.locals.items.push(setItems(item));
            });
        }
    }

    function setItems(item) {
        if (req.query.filter !== undefined) {
            var urlData = req.query.filter.split(",");
            if (urlData.length > 0) {
                var result = {};
                for (var i = 0; i < urlData.length; i++) {
                    var boolean = contains(urlData[i], item);
                    if (boolean == true) {
                        result[urlData[i]] = item[urlData[i]];
                    }
                }
                return result;
            }
            else return;
        }
    };

    function contains(urlData, item) {
        var filterData = ["title", "type", "src", "views", "description", "ranking"];
        if (filterData.indexOf(urlData) == -1) {
            res.status(400);
            return false;
        }
        return true;
    }

    next();
});

module.exports = router;