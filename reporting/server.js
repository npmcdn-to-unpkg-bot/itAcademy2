var express = require('express');
var path = require('path');
var router = express.Router();

module.exports = function() {
    var app = express();

    app.use(express.static(path.join(__dirname, 'public')));


    var index = path.join(__dirname, "public", "index.html");

    router.get('/', function(req, res) {
        res.sendFile(index);
    });

    router.get('/warehouse', function(req, res) {
        res.sendFile(index);
    });

    router.get('/shop', function(req, res) {
        res.sendFile(index);
    });

    app.use("/", router);

    app.use("*", function(req, res) {
        res.sendFile(__dirname + "/public/err/404.html");
    });

    return app;
};
