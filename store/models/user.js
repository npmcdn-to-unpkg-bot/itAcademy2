var config = require('../config');
var mongoose = require('../libs/mongoose');
var Schema = mongoose.Schema;

// require Item to populate Order itemSet later
var Item = require('./item');

var userSchema = new Schema;
var classes = 'not-registered registered store-admin super-admin'.split(' ');

userSchema.add({
  storeId: {
    type: Schema.Types.ObjectId,
    required: true
  },
  name: {
    type: String
  },
  surname: {
    type: String
  },
  email: {
    type: String,
    unique: true
  },
  class: {
    type: String,
    enum: classes,
    required: true
  },
  password: {
    type: String
  },
  cart: {
    type: [{type: Schema.Types.ObjectId, ref: 'Item'}]
  },
  account: {
    type: Number
  }
});

userSchema.methods.validPassword = function(pwd) {
  return pwd === this.password
};

module.exports = mongoose.model('User', userSchema, 'users');
