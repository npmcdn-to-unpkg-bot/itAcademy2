/**
 * Created by Olexa on 13.04.2016.
 */
var express = require('express');
var app = express();
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

app.use(express.static(__dirname + '/public'));

var Account = mongoose.model('Account', {
    login : String,
    password : String,
    amount : {type: Number, min: 0}
});

var Transaction = mongoose.model('Transaction', {
    token: {type: String, unique: true},
    time: Date,
    source: String,
    destination: String,
    amount: Number
});


app.get('/api/accounts', function(req, res) {
    Account.find(function(err, accounts) {
        if(err)
        {
            res.send(err);
        }
        res.json(accounts);
    });
});

app.get('/api/checkBalance', function(req, res) {
   Account.findOne({ 'login': req.body.login, 'password': req.body.password},
       function(err, account) {
            if(err)
           {
               res.send(err);
           }
           res.json(account);
   });
});

app.post('/api/transfer', function(req, res) {
    var token = guid.Guid();
   /* Transaction.create({
        token: token,
        time: Date.now(),
        source: req.body.source,
        destination: req.body.destination,
        amount: req.body.amount
    }).then(function() {
        return Account.update({
                'login': req.body.source,
                'password': req.body.password
            },
            {
                $dec: {amount: req.body.amount}
            });
    }).catch(function (err) {
        res.send({success: false,
            message: "Bad data entered!"});
        })
    .then( function() {
        return  Account.update({'login': req.body.destination}, { $inc: { amount: req.body.amount }})
    }).catch(function (err) {
        res.send({
            success: false,
            message: "serv err"
        });
    })
    .then(function() {
        res.json({
            success: success,
            message: message,
            token: token
        });
    });
    */



    ////
    Promise.all([
        Account.update({'login': req.body.source, 'password': req.body.password},{ $inc: { amount: -req.body.amount}}),
        Account.update({'login': req.body.destination}, { $inc: { amount: req.body.amount }})
    ]).then(function () {
       return  Transaction.create({
            token: token,
            time: Date.now(),
            source: req.body.source,
            destination: req.body.destination,
            amount: req.body.amount
        });
    })
        .then(function () {
            res.json({
                success: true,
                message: message,
                token: token
            });
        })
        .catch(function (err) {
            console.log(err.stack);
            res.send({
                success: false,
                message: "server err"
            });
        })
});

app.post('/api/getMoney', function(req, res) {
    var token = guid.Guid();

    Promise.all([
        Account.update({
            login: req.body.login, password: req.body.password
        }, {$inc: {amount: 500}}),
        Transaction.create({
            token: token,
            time: Date.now(),
            source: 'salary',
            destination: req.body.login,
            amount: 500
        })

    ]).then(Account.find(function (err, accounts) {
            if (err) {
                res.send(err);
            }
            res.json(accounts);
    }));
});

app.get('/api/checkOperation', function(req, res)
{
    Transaction.findOne({
        token: req.body.token,
        source: req.body.source,
        destination: req.body.destination,
        amount: req.body.amount
    }, function(err, operations){
        if(err)
        {
            res.send(err);
        }
        res.json({success: true});
    })
});

app.post('/api/accounts', function(req, res)
{
    Account.create({
        login : req.body.login,
        password: req.body.password,
        amount: 0
    }, function(err, accounts) {
        if (err) {
            res.send(err);
        }
        Account.find(function(err, accounts)
        {
            if (err)
            {
                res.send(err);
            }
            res.json(accounts);
        });
    });
});




app.delete('/api/accounts/:account_id', function(req, res) {
    Account.remove({
        _id: req.params.account_id
    }, function(err, account) {
        if(err)
        {
            res.send(err);
        }
        Account.find(function(err, accounts) {
            if(err)
            {
                res.send(err);
            }
            res.json(accounts);
        });
    });
});

app.listen(3001);
console.log("App listening on port 3001");