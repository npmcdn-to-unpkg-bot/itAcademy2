#!/usr/bin/env node

var debug = require('debug')('passport-mongo');
var app = require('./app');


app.set('port', process.env.PORT || 3003);


var server = app.listen(app.get('port'), function() {
  console.log('Store admin running at http://127.0.0.1:' + server.address().port);
});
