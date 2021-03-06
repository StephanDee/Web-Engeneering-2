/**
 * Exercise 2
 *
 * @author Nessi, Julius, Stephan
 * @license BSD-3-Clause
 */
"use strict";
var express = require('express');
var path = require('path');

// $ yarn add dateformat
var dateFormat = require('dateformat');

// Get methods to read files - $ yarn add fs
var fs = require('fs');

var app = express();

// add route to static files - Task 3
app.use('/staticfiles', express.static(path.join(__dirname, 'public')));

// Task 4
app.use('/time',
    /**
     * Shows the current Systemtime.
     *
     * @param req http request
     * @param res http response
     */
    function currentTime(req, res) {
        res.header('Content-Type', 'text/plain');
        res.send(dateFormat(res.systemDate, "yyyy-mm-dd h:MM:ss"));
    });

// Task 5a
/**
 * Calculates the time of process.
 *
 * @returns time in nanoseconds
 */
function TimeInNs(time) {
    // converts hrtime to ns
    var result = time[1] / 1000;
    return result;
}

app.use('/file.txt',
    /**
     * Read file asynchronously (non-blocking) and sends back the processing time.
     *
     * @param req http request
     * @param res http response
     */
    function (req, res) {
        // process is always available to Node.js applications without using require()
        var start = process.hrtime();
        fs.readFile('file.txt', 'utf8', function (err, file) {
            var end = process.hrtime(start);
            if (err) {
                // If file not found
                return console.log(err);
                res.status(503).end();
            } else {
                res.header('Content-Type', 'text/plain');
                res.send(file + "\n\n" + TimeInNs(end) + " ns");
            }
        });
    });

// add and configure Route / - Task 1
app.get('/*', function (req, res) {
    res.send('<!DOCTYPE html>' +
        '<html lang="en">' +
        '<head><meta charset="utf-8"></head>' +
        '<body><h1>Hello World!</h1></body>' +
        '</html>'
    );
});

// start server
var server = app.listen(3000, function () {
    console.log('1st App \'helloworld\' is ready and listening at http://localhost:3000'
        + '\n2nd App \'Predator Website\' is ready and listening at http://localhost:3000/staticfiles/index.html'
        + '\n3rd App \'current Systemtime\' is ready and listening at http://localhost:3000/time'
        + '\n4th App \'read file\' is ready and listening at http://localhost:3000/file.txt');
});