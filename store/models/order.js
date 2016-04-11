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
  itemSet: [{type: Schema.Types.ObjectId, ref: 'Item'}],
  transactionId: {
    type: Schema.Types.ObjectId
  }
});

module.exports = mongoose.model('Order', orderSchema, 'orders');
