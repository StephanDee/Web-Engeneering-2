var express = require('express');
var app = express();

// add and configure Route /
app.get('/', function (req, res) {
	
res.send('<!DOCTYPE html>' +
'<html lang="en">' +
'<head><meta charset="utf-8"></head>' +
'<body><h1>Hello World!</h1></body>' +
'</html>'
);
});
var server = app.listen(3000, function () {
console.log('helloworld app is ready and listening at http://localhost:3000');
});