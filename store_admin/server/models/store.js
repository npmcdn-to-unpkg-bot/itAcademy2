// store model
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');


var Store = new Schema({
    storename: {
        type: String,
        required: true
     },
     password: {
         type: String,
         required: true
     },
     email: {
         type: String,
         required: true
     },
     account: {
         type: Number,
         required: true
    }
});

Store.plugin(passportLocalMongoose);


module.exports = mongoose.model('stores', Store);