/** This module provides middleware to respond with proper JSON error objects
 * using NODE_ENV setting to production or development. In dev mode it send the stacktrace.
 *
 * You call the returned function with an app instance
 *
 *  @author Johannes Konert
 * @licence  CC BY-SA 4.0
 *
 *
 * @module restapi/error-response
 * @type {Function}
 */
"use strict";
var logger = require('debug')('we2:error-response');

module.exports = function registerErrorHandlers(app) {
    // development error handler
    // will print stacktrace as JSON response
    if (app.get('env') === 'development') {
        app.use(function(err, req, res, next) {
            logger('Internal Error: ', err.stack);
            res.status(err.status || 500);
            res.json({
                error: {
                    message: err.message,
                    error: err.stack
                }
            });
        });
    } else {
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
    }
};