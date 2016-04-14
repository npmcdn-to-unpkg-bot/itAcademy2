var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var itemSchema = new Schema({
        name: String,
        description: String,
        image: String,
        category: String
});

module.exports = mongoose.model('items', itemSchema);


