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
    Error.call(this,message);
    if (status && !status instanceof Number) {
        throw "second parameter 'status' needs to be a Number, but is "+typeof(status);
    }
    this.status = status || 500;
}
HttpError.prototype = Object.create(Error.prototype);

module.exports = HttpError;
