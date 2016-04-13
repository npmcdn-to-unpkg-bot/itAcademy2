var config = require('../config');
var mongoose = require('../libs/mongoose');
var Schema = mongoose.Schema;

var storeSchema = new Schema;

storeSchema.add({
  email: {
    type: String,
    unique: true,
    required: true
  },
  name: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  account: {
    type: Number,
    unique: true,
    required: true
  }
});

module.exports = mongoose.model('Store', storeSchema, 'stores');
