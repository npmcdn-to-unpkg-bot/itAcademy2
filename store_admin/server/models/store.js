var mongoose = require('mongose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var Store = new Schema({
    name: {
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

module.export = mongoose.model('stores', Store);
