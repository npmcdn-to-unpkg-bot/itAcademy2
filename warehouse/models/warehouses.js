var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var warehousesSchema = new Schema({
    nameWarehouse: String,
    date: {
        type: Date,
        default: Date.now
    },
    available: {
        type: Boolean,
        default: true
    },
    warehouseAccount: String,
    itemSet: [{
        id:Schema.Types.ObjectId,
        amount: Number,
        price: Number
    }]

});

module.exports = mongoose.model('warehouses', warehousesSchema);

