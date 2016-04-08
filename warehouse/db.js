var config = require('./config');
var mongojs = require('mongojs')
var db = mongojs(config.dbConnection, config.collections);

function Warehouse(name) {
    this.nameWarehouse = name;
    this.date = Date.now();
    this.available = true;
};
var warehouse = new Warehouse('superCompany');


module.exports.fillDb = function () {
    db.warehouses.insert(warehouse, function (err, saved) {
        if (err || !saved) console.log("company not saved");
        else console.log("company saved");
    });  
}








/*
var schemaWarehouse = new mongoose.Schema({
    nameWarehouse: String,
    date: {
        type: Date,
        default: Date.now
    },
    available: {
        type: Boolean,
        default: true
    },
    warehouseAccount: Number,
    itemSet: [/!*{
     id: Number,
     amount: Number,
     price: Number
     }*!/]
});

var schemaItem = new mongoose.Schema({
    name: String,
    description: String,
    image: String,
    category: String
});
*/

