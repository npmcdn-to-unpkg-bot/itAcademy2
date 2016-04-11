var config = require('../config');
var mongoose = require('../libs/mongoose');
var Schema = mongoose.Schema;

var warehouseSchema = new Schema;

warehouseSchema.add({
  name: {
    type: String,
    required: true
  },
  account: {
    type: String,
    required: true
  },
  storeId: {
    type: Schema.Types.ObjectId,
    required: true
  }
});

module.exports = mongoose.model('Warehouse', warehouseSchema, 'warehouses');
