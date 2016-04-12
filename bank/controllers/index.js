var express = require('express');
var app = express();

module.exports.set = function(app) {
    app.get('/', function (req, res) {
     res.send('Hello World');
    });
}