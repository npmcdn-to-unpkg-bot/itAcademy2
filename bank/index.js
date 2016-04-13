var express = require('express');
var app = express();
var cookieParser = require('cookie-parser');
app.use(cookieParser());

var bodyParser = require('body-parser')
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));

/////////
require('./controllers').set(app);

var start = function(){
    app.listen(3000, function () {
        console.log('Bank app listening on port 3000');
    });
}


module.exports = {
    start: start
}