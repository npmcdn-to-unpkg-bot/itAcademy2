var config = require('../config');
var mongoose = require('../libs/mongoose');
var Schema = mongoose.Schema;

var itemSchema = new Schema;

itemSchema.add({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  image: {
    type: String
  },
  price: {
    type: Number
  },
  category: {
    type: String,
    required: true
  },
  storeId: {
    type: Schema.Types.ObjectId,
    required: true
  },
  originalPrice: {
    type: Number,
    required: true
  },
  count: {
    type: Number,
    required: true
  }
});

module.exports = mongoose.model('Item', itemSchema, 'items');
