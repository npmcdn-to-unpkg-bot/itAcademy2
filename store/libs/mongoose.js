var mongoose = require('mongoose');
var config = require('../config');

mongoose.connect(config.dbConnection);

module.exports = mongoose;
