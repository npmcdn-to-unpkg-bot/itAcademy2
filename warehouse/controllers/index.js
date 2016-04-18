var express = require('express');
var app = express();
var config = require('../config');
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
    app.post('/buyItems/:id', function (req, res) {//TODO check if items is available then -,
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
        prom.then(function () {//onFulfilled check if enough items in warehouse
            if (!req.body.items.every(isEnoughItems))throw new Error();
            function isEnoughItems(item) {
                Warehouse.findById(req.params.id, function (err, data) {
                    if (err)throw new Error();
//TODO we have [{id:4,amount:1},{id:5,amount:2}] and check item.amount-data.itemSet[0-n].amount>0?
                })
            }
        }, function () {//onRejected
            res.send({
                success: false,
                message: "Bank has not confirmed your payment"
            })
        }).then(function () {
            res.send({
                success: true,
                message: "The transaction was successful"
            })
        }, function () {
            res.send({
                success: false,
                message: "There is no enough items for your query"
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


    app.get('/warehouse', function (req, res) {//gets the list of warehouses
        Warehouse.find({}, function (err, data) {
            if (err)
                return res.send({
                    error: 'Error while making response'
                });
            return res.send(data);
        });

    });
    app.post('/warehouse', function (req, res) {//add new warehouse
        var warehouse = new Warehouse();
        warehouse.nameWarehouse = req.body.nameWarehouse;
        warehouse.date = Date.now();
        warehouse.available = true;
        warehouse.warehouseAccount = req.body.warehouseAccount;//TODO warehouse acc provided by bank. we must to send pass

        warehouse.save(function (err, saved) {
            if (err || !saved) res.send({error: 'Error while insert a record'});
            return res.send(saved);
        });
    });
    app.delete('/warehouse/:id', function (req, res) {//delete warehouse byId
        Warehouse.findByIdAndRemove(req.params.id, function (err, data) {
            if (err)
                return res.send({error: 'Error while deleting a record'});
            return res.send(data);
        });


    });
    app.delete('/warehouse', function (req, res) {//delete all warehouses
        Warehouse.remove(function (err, data) {
            if (err)
                return res.send({error: 'Error while deleting records'});
            return res.send(data);
        });


    });
    //itemSet api
    app.get('/getItems/:id', function (req, res) {//getItems by warehouse ID
        Warehouse.findById(req.params.id, function (err, data) {
            if (err)
                return res.send({error: 'Error while getting records'});
            return res.send(data.itemSet);
        });


    });
    app.post('/items/:id', function (req, res) {//addItemSet in warehouse with ID
        Warehouse.update({_id: req.params.id}, {$push: {itemSet: {$each: req.body.itemSet}}}, {upsert: true}, function (err, data) {
            if (err)
                return res.send({error: 'Error while insert items'});
            return res.send(data);
        });


    });
    app.put('/items/:id', function (req, res) {//TODO change ItemSet in warehouse with ID
        var listOfItems = _.map(req.body.itemSet, function (val) {
            return val;
        })
        Warehouse.update({_id: req.params.id}.where('itemSet').in(listOfItems), {$push: {itemSet: {$each: req.body.itemSet}}}, {upsert: true}, function (err, data) {
            if (err)
                return res.send({error: 'Error while insert items'});
            return res.send(data);
        });
    });
    app.post('/items/:id', function (req, res) {//add ItemSet in warehouse with ID
        var listOfItems = _.map(req.body.itemSet, function (val) {
            return val;
        })

        Warehouse.update({_id: req.params.id}.where('itemSet').in(listOfItems), {$push: {itemSet: {$each: req.body.itemSet}}}, {upsert: true}, function (err, data) {
            if (err)
                return res.send({error: 'Error while insert items'});
            return res.send(data);
        });
    });
    //items api
    app.get('/item', function (req, res) {
        Item.find({}, function (err, data) {
            if (err)
                return res.send({
                    error: 'Error while making response'
                });
            return res.send(data);
        });

    });
    app.post('/item', function (req, res) {//add new item
        var item = new Item();
        item.name = req.body.name;
        item.description = req.body.description;
        item.image = req.body.image;
        item.category = req.body.category;
        item.save(function (err, saved) {
            if (err || !saved) res.send({error: 'Error while insert a record'});
            return res.send(saved);
        });
    });
    app.put('/item/:id', function (req, res) {//change item
        Item.findByIdAndUpdate(req.params.id, {
            $set: {
                name: req.body.name,
                description: req.body.description,
                image: req.body.image,
                category: req.body.category
            }
        }, function (err, item) {
            if (err) res.send({error: 'Error while saving a record'});
            res.send(item);
        });
    })


    app.delete('/item/:id', function (req, res) {//delete item byId

        Item.findByIdAndRemove(req.params.id, function (err, data) {
            if (err)
                return res.send({error: 'Error while deleting a record'});
            return res.send(data);
        });
    });


}