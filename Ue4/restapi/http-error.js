/**
 * a prototype child definition HttpError of Error which has a constructor that allows message and http-status-code
 *
 * @author Johannes Konert
 * @licence MIT
 */
"use strict";
/**
 *  HttpError (based on prototype Error)
 * @param message {String} the error message
 * @param status {Number} valid HTTP Status code (will be available as public attribute .status)
 * @returns {HttpError} instance
 * @constructor
 */
function HttpError (message, status) {
    if (!this instanceof Error) {
        // in case someone called this without "new"; then do it
        return new HttpError(message, status);
    }
    var error = Error.call(this,message);

    // as Error does not properly instances new instances, we proxy its properties
    Object.getOwnPropertyNames(error).forEach(function(p) {
        Object.defineProperty(this, p,
            Object.getOwnPropertyDescriptor(error, p));
    }, this);

    if (status && !status instanceof Number) {
        throw "second parameter 'status' needs to be a Number, but is "+typeof(status);
    }
    this.status = status || 500;

}
HttpError.prototype = Object.create(Error.prototype, {
    constructor: {value:HttpError, configurable:true},
    name: {value:"HttpError", configurable:true}
});

module.exports = HttpError;
