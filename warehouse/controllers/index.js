var express = require('express');
var app = express();
var config = require('../config');
//var mongojs = require('mongojs');//del
//var db = mongojs(config.dbConnection, config.collections);//del
//db
var mongoose = require('mongoose');
mongoose.connect(config.dbConnection);
var Warehouse = require('../models/warehouses');
var Item = require('../models/items');


var http = require('http');
var _ = require('underscore');


module.exports.set = function (app) {
    app.get('/getItems/:id', function (req, res) {//getTheItemSetInWarehouse:id
        Warehouse.findById(req.params.id, function (err, data) {
            if (err)
                return res.send({
                    error: 'Error while making response'
                });
            return res.send(data.itemSet);
        });

    });
    app.post('/buyItems/:id', function (req, res) {//TODO
        //:id ==warehouse account
        var prom = new Promise(function (resolve, reject) {
            var data = {
                token: req.body.token,
                source: req.body.storeAccount,
                destination: req.params.id,
                amount: req.body.amount
            };
            var options = {
                host: 'localhost', //here is server of bank
                path: '/checkOperation',
                port: 3000,
                method: 'GET',
                qs: data
            };
            var req = http.request(options, function (res) {
                res.setEncoding('utf8');
                res.on('data', function (chunk) {
                    console.log("bank say:" + chunk);
                    if (chunk.sucess)return true;
                    return false;
                });
            });

            req.write(data);
            req.end();
        });
        prom.then(function () {//onFulfilled
            res.send({
                success: true,
                message: "The transaction was successful"
            })
        }, function () {//onRejected
            res.send({
                success: false,
                message: "Bank has not confirmed your payment"
            })
        });
    })

    app.get('/getWarehouses', function (req, res) {
        var filter = {
            available: true
        };
        Warehouse.find(filter, function (err, data) {//del
            if (err)
                return res.send({
                    error: 'Error while making response'
                });
            return res.send(data);
        });

    });


    app.get('/warehouse', function (req, res) {
        Warehouse.find({}, function (err, data) {
            if (err)
                return res.send({
                    error: 'Error while making response'
                });
            return res.send(data);
        });

    });
    app.post('/warehouse', function (req, res) {
        var warehouse = new Warehouse();
        warehouse.nameWarehouse = req.body.nameWarehouse;
        warehouse.date = Date.now();
        warehouse.available = true;
        warehouse.warehouseAccount = req.body.warehouseAccount;//TODO warehouse acc provided by bank. we must to send pass

        warehouse.save(function (err, saved) {
            if (err || !saved) res.send({error: 'Error while insert a record'});
            return res.sendStatus(200);
        });
    });
    app.delete('/warehouse/:id', function (req, res) {
        var filter = {_id: mongojs.ObjectId(req.params.id)};
        Warehouse.remove(filter, function (err) {
            if (err)
                return res.send({error: 'Error while deleting a record'});
            return res.sendStatus(200);
        });


    });
    app.delete('/warehouse', function (req, res) {
        Warehouse.remove(function (err) {
            if (err)
                return res.send({error: 'Error while deleting a records'});
            return res.sendStatus(200);
        });


    });
}