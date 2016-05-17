/**
 * Created by Olexa on 13.04.2016.
 */
var express = require('express');
var app = express();
var path = require('path');
var mongoose = require('mongoose');
var morgan = require('morgan');             // log requests to the console (express4)
var bodyParser = require('body-parser');    // pull information from HTML POST (express4)
var methodOverride = require('method-override');
var guid = require('./guidGenerator');
var Promise = require('bluebird');
mongoose.connect('mongodb://elifuser:qwerty12@ds015710.mlab.com:15710/elifbankdb');

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({'extended':'true'}));
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.json({type: 'application/vnd.api+json'}));
app.use(methodOverride());

app.set('public', path.join(__dirname, 'public'));


var Account = require('./models/account.js');
var Transaction = require('./models/transaction.js');

var routes = require('./routes/index.js')();
app.use('/', routes);

var expressSession = require('express-session');
app.use(expressSession({secret: 'mySecretKey'}));

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

if (require.main === module) {
    app.listen(3001);
    console.log("App listening on port 3001");
} else {
    module.exports = app;
}

