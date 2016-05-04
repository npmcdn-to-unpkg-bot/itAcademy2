var crypto = require('crypto'),
    mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    async = require('async');

var TransactionSchema = new mongoose.Schema({
    token: {type: String, unique: true},
    time: Date,
    source: String,
    destination: String,
    amount: Number
});

var Transaction = mongoose.model('Transaction', TransactionSchema);
