var config = require('../config');
var Promise = require("bluebird");
var mongoose = Promise.promisifyAll(require("mongoose"));

mongoose.connect(config.dbConnection);

module.exports = mongoose;
