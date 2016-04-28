var express = require('express');
var app = express();
var config = require('./config');
var bodyParser = require('body-parser');
app.use(bodyParser.json());  

require('./controllers').set(app);

app.listen(config.port, function () {
	console.log('Warehouse app listening on port '+ config.port);
});
