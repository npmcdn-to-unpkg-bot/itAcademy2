
var mongoose = require('mongoose');

module.exports = mongoose.model('Account', {
    login : {type: String, unique: true, required: true},
    password : {type: String, required: true},
    amount : {type: Number, min: 0, default: 0}
});