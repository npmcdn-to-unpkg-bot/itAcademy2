var config = require('../config');
var mongoose = require('../libs/mongoose');
var Schema = mongoose.Schema;

var itemSchema = new Schema;

itemSchema.add({
  title: {
    type: String,
    unique: true,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  image: {
    type: String
  },
  category: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Item', itemSchema, 'items');
