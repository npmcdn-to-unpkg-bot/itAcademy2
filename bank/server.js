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

var isAuthenticated = function (req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/');
};

var passport = require('passport');
var expressSession = require('express-session');
app.use(expressSession({secret: 'mySecretKey'}));
app.use(passport.initialize());
app.use(passport.session());
var initPassport = require('./passport/init');
initPassport(passport);

var routes = require('./routes/index')(passport);
app.use('/', routes);

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

//app.get('/api/accounts', function(req, res) {
//    Account.find(function(err, accounts) {
//        if(err)
//        {
//            res.send(err);
//        }
//        res.json(accounts);
//    });
//});

/*app.get('/api/checkBalance', function(req, res) {
   Account.findOne({ 'login': req.body.login, 'password': req.body.password},
       function(err, account) {
            if(err)
           {
               res.send(err);
           }
           res.json(account);
   });
});*/

//app.post('/api/transfer', function(req, res) {
//    var token = guid.Guid();
//   /* Transaction.create({
//        token: token,
//        time: Date.now(),
//        source: req.body.source,
//        destination: req.body.destination,
//        amount: req.body.amount
//    }).then(function() {
//        return Account.update({
//                'login': req.body.source,
//                'password': req.body.password
//            },
//            {
//                $dec: {amount: req.body.amount}
//            });
//    }).catch(function (err) {
//        res.send({success: false,
//            message: "Bad data entered!"});
//        })
//    .then( function() {
//        eturn  Account.update({'login': req.body.destination}, { $inc: { amount: req.body.amount }})
//    }).catch(function (err) {
//        res.send({
//            success: false,
//            message: "serv err"
//        });
//    })
//    .then(function() {
//        res.json({
//            success: success,
//            message: message,
//            token: token
//        });
//    });
//    */
//
//
//
//    ////
//    Promise.all([
//        Account.update({'login': req.body.source, 'password': req.body.password},{ $inc: { amount: -req.body.amount}}),
//        Account.update({'login': req.body.destination}, { $inc: { amount: req.body.amount }})
//    ]).then(function () {
//       return  Transaction.create({
//            token: token,
//            time: Date.now(),
//            source: req.body.source,
//            destination: req.body.destination,
//            amount: req.body.amount
//        });
//    })
//        .then(function () {
//            res.json({
//                success: true,
//                message: message,
//                token: token
//            });
//        })
//        .catch(function (err) {
//            console.log(err.stack);
//            res.send({
//                success: false,
//                message: "server err"
//            });
//        })
//});

//app.post('/api/getMoney', function(req, res) {
//    var token = guid.Guid();
//
//    Promise.all([
//        Account.update({
//            login: req.body.login, password: req.body.password
//        }, {$inc: {amount: 500}}),
//        Transaction.create({
//            token: token,
//            time: Date.now(),
//            source: 'salary',
//            destination: req.body.login,
//            amount: 500
//        })
//
//    ]).then(Account.find(function (err, accounts) {
//            if (err) {
//                res.send(err);
//            }
//            res.json(accounts);
//    }));
//});

//app.get('/api/checkOperation', function(req, res)
//{
//    Transaction.findOne({
//        token: req.body.token,
//        source: req.body.source,
//        destination: req.body.destination,
//        amount: req.body.amount
//    }, function(err, operations){
//        if(err)
//        {
//            res.send(err);
//        }
//        res.json({success: true});
//    })
//});

//app.post('/api/accounts', function(req, res)
//{
//    Account.create({
//        login : req.body.login,
//        password: req.body.password,
//        amount: 0
//    }, function(err, accounts) {
//        if (err) {
//            res.send(err);
//        }
//        Account.find(function(err, accounts)
//        {
//            if (err)
//            {
//                res.send(err);
//            }
//            res.json(accounts);
//        });
//    });
//});




//app.delete('/api/accounts/:account_id', function(req, res) {
//    Account.remove({
//        _id: req.params.account_id
//    }, function(err, account) {
//        if(err)
//        {
//            res.send(err);
//        }
//        Account.find(function(err, accounts) {
//            if(err)
//            {
//                res.send(err);
//            }
//            res.json(accounts);
//        });
//    });
//});

app.listen(3001);
console.log("App listening on port 3001");