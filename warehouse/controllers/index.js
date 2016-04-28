var config = require('../config');
var mongojs = require('mongojs')
var db = mongojs(config.dbConnection, config.collections);
var _ = require('underscore');


module.exports.set = function (app) {
    app.get('/getItems/:wId', function (req, res) {

    });

    app.post('/buyItems/:id', function (req, res) {


    })

    app.get('/getWarehouses', function (req, res) {

    });
}