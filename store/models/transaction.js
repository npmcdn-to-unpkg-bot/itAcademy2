var config = require('../config');
var mongoose = require('../libs/mongoose');
var Schema = mongoose.Schema;

var transactionSchema = new Schema;

transactionSchema.add({
  token: {
    type: String,
    required: true
  },
  accountFrom: {
    type: String,
    required: true
  },
  accountTo: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  }
});

module.exports = mongoose.model('Transaction', transactionSchema, 'transactions');
