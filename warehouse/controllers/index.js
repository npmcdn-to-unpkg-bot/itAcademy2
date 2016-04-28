var config = require('../config');
var mongojs = require('mongojs')
var db = mongojs(config.dbConnection, config.collections);
var _ = require('underscore');
var Promise = require('bluebird');


module.exports.set = function (app) {
    app.get('/getWarehouses', function (req, res) {
        Promise.fromNode((callback) => {
            var filter = {},
                projection = {_id: 1, name: 1, bankAccount: 1 };

            db.warehouses.find(filter, projection, callback);
        })
        .map((item) => {
            return {
                warehouseId: item._id.toString(),
                name: item.name,
                bankAccount: item.bankAccount
            };
        })
        .then((data) => {
            res.send(data);
        })
        .catch(function(err){
            console.log(err.stack);
            res.send({error: err.message});
        });
    });


    app.get('/getItems/:wId', function (req, res) {
        var itemSet;
        Promise.fromNode((callback) => {
            var filter = {_id: mongojs.ObjectId(req.params.wId)},
                projection = {itemSet: 1};
            db.warehouses.findOne(filter, projection, callback);
        })
        .then((warehouse) => {
            if (!warehouse)
                throw 'no such a warehouse';

            itemSet = warehouse.itemSet;
            var ids = _.uniq(_.map(itemSet, (item) => {
                return mongojs.ObjectId(item.itemId);
            }));

            return Promise.fromNode((callback) => {
                var filter = {_id: {$in: ids}};
                db.items.find(filter, callback);
            });
        })
        .map((item) => {
            var itemSetValue = _.find(itemSet, (i) => {
                return i.itemId === item._id.toString()
            });

            return _.extend(_.pick(item, 'name', 'category', 'image', 'description'), {
                id: item._id.toString(),
                amount: itemSetValue.amount,
                price: itemSetValue.price
            });
        })
        .then((data) => {
            res.send(data)
        })
        .catch(function(err){
            console.log(err.stack);
            res.send([]);
        });
    });

    app.post('/buyItems/:id', function (req, res) {

    });
}