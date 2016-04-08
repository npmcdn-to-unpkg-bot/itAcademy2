var express = require('express');
var app = express();
var bodyParser = require('body-parser')
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 
app.use(express.static(__dirname + '/public'));

require('./controllers').set(app);

module.exports.start = function(){
	app.listen(3010, function () {
	  console.log('Warehouse app listening on port 3010');
	});
}