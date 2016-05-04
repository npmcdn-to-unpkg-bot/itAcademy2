/**
 * Created by Olexa on 22.04.2016.
 */
var crypto = require('crypto'),
    mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    async = require('async');

var AccountSchema = new mongoose.Schema({
    login : {type: String, unique: true, required: true},
    password : {type: String, required: true},
    amount : {type: Number, min: 0}
});

var Account = mongoose.model('Account', AccountSchema);

