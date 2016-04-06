var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var warehouses = new Schema({
    idWarehouse: Number,
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
    warehouseAssortment: [{
        id: Number,
        amount: Number,
        price: Number,
        description: String,
        image: String,
        category: String
    }]
})