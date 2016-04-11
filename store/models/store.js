var config = require('../config');
var mongoose = require('../libs/mongoose');
var Schema = mongoose.Schema;

var storeSchema = new Schema;

storeSchema.add({
  email: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  account: {
    type: Number,
    required: true
  }
});

module.exports = mongoose.model('Store', storeSchema, 'stores');
