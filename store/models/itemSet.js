var config = require('../config');
var mongoose = require('../libs/mongoose');
var Schema = mongoose.Schema;

var itemSetSchema = new Schema;

itemSetSchema.add({
  storeId: {
    type: Schema.Types.ObjectId,
    required: true
  },
  itemId: {
    type: Schema.Types.ObjectId,
    required: true
  },
  originalPrice: {
    type: Number,
    required: true
  },
  price: {
    type: Number
  },
  count: {
    type: Number,
    required: true
  }
});

module.exports = mongoose.model('ItemSet', itemSetSchema, 'itemSet');
