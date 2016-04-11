var express = require('express');
var app = express();
var config = require('../config');
var mongojs = require('mongojs')
var db = mongojs(config.dbConnection, config.collections);
var http = require('http');
var querystring = require('querystring');
var _ = require('underscore');


function checkTransfer(token, storeAccount) {
    var data = querystring.stringify({
        token: token,
        storeAccount: storeAccount
    });
    var options = {
        host: '127.0.0.1',
        path: '/checkTransfer',
        port: 3003,
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(data)
        }
    };
    var req = http.request(options, function(res) {
        res.setEncoding('utf8');
        res.on('data', function(chunk) {
            console.log("body: " + chunk);
        });
    });

    req.write(data);
    req.end();
}


module.exports.set = function(app) {
    app.get('/getItems/:id', function(req, res) {
        var filter = {
            _id: mongojs.ObjectId(req.params.id)
        };
        db.warehouses.find(filter, function(err, data) {
            if (err)
                return res.send({
                    error: 'Error while making response'
                });
            return res.send(data);
        });

    });
    app.post('/buyItems/', function(req, res) {
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
        app.get('/getWarehouses', function(req, res) {
            var filter = {
                available: true
            };
            db.warehouses.find(filter, function(err, data) {
                if (err)
                    return res.send({
                        error: 'Error while making response'
                    });
                return res.send(data);
            });

        });

    });

}