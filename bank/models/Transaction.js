var mongoose = require('mongoose');

module.exports = mongoose.model('Transaction',{

    token: {type: String, unique: true},
    time: Date,
    source: String,
    destination: String,
    amount: Number
});