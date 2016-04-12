var express = require('express');
var app = express();
var config = require('../config');
var mongojs = require('mongojs');
var db = mongojs(config.dbConnection, config.collections);
var http = require('http');
var querystring = require('querystring');
var _ = require('underscore');


function checkTransfer(token, storeAccount, warehouseAccount, amount) {
    var data = querystring.stringify({
        token: token,
        source: storeAccount,
        destination: warehouseAccount, //warehouse account??
        amount: amount
    });
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
}


module.exports.set = function (app) {
    app.get('/getItems/:id', function (req, res) {
        var filter = {
            _id: mongojs.ObjectId(req.params.id)
        };
        db.warehouses.find(filter, function (err, data) {
            if (err)
                return res.send({
                    error: 'Error while making response'
                });
            return res.send(data);
        });

    });
    app.post('/buyItems', function (req, res) {
        var filter = {
            _id: mongojs.ObjectId(req.body.idWarehouse),

        };


        if (checkTransfer(token, storeAccount)) {
            res.send({
                success: true,
                message: "The transaction was successful"
            })

        } else {
            res.send({
                success: false,
                message: "Bank has not confirmed your payment"
            })
        }
        app.get('/getWarehouses', function (req, res) {
            var filter = {
                available: true
            };
            db.warehouses.find(filter, function (err, data) {
                if (err)
                    return res.send({
                        error: 'Error while making response'
                    });
                return res.send(data);
            });

        });

    });

    app.get('/warehouse', function (req, res) {
        db.warehouses.find({}, function (err, data) {
            if (err)
                return res.send({
                    error: 'Error while making response'
                });
            return res.send(data);
        });

    });
    app.post('/warehouse', function (req, res) {
        var warehouse = {
            nameWarehouse: req.body.nameWarehouse,
            date: Date.now(),
            available: true,
            warehouseAccount: req.body.warehouseAccount,
            itemSet: []
        };
        db.warehouses.insert(warehouse, function (err, saved) {
            if (err || !saved) console.log("warehouse not saved");
            return res.sendStatus(200);
        });
    });
    app.delete('/warehouse/:id', function (req, res) {
        var filter = {_id: mongojs.ObjectId(req.params.id)};
        db.warehouses.remove(filter, function(err){
            if (err)
                return res.send({error: 'Error while deleting a record'});
            return res.sendStatus(200);
        });


    });
    app.delete('/warehouse', function (req, res) {
        db.warehouses.remove({}, function(err){
            if (err)
                return res.send({error: 'Error while deleting a records'});
            return res.sendStatus(200);
        });


    });
}