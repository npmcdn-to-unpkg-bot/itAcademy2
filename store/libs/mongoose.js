var mongoose = require('mongoose');
var config = require('../config');

mongoose.connect(config.dbConnection);
mongoose = require('bluebird').promisifyAll(mongoose);

module.exports = mongoose;
