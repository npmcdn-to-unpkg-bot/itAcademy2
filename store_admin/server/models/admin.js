// admin model
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var role = 'not-registered registered store-admin super-admin'.split(' ');

var Admin = new Schema({
    storeId: Schema.Types.ObjectId,
    name: String,
    password: String,
    class: {
        type: String,
        enum: role
    },
    account: Number
});

userSchema.methods.validPassword = function(pwd) {
  return pwd === this.password
};

module.exports = mongoose.model('admin', Admin);