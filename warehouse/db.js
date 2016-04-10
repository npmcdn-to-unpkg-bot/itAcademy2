/*
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
*/

// Retrieve
var MongoClient = require('mongodb').MongoClient;

// Connect to the db
module.exports.fillDb = function () {
    /*MongoClient.connect("mongodb://admin:qwertyuiop@ds017070.mlab.com:17070/warehouse", function(err, db) {
        if(!err) {
            console.log("We are connected");
        }else{
            console.log(err);
        }
    });*/

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

