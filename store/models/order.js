var config = require('../config');
var mongoose = require('../libs/mongoose');
var Schema = mongoose.Schema;

// require Item to populate Order itemSet later
var Item = require('./item');

var orderSchema = new Schema;

orderSchema.add({
  date: {
    type: Date,
    required: true
  },
  itemSet: [],
  user: {
    type: String,
    required: true
  },
  transactionId: {
    type: Schema.Types.ObjectId
  }
});

module.exports = mongoose.model('Order', orderSchema, 'orders');
