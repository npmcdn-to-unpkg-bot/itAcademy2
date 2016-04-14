/**
 * Created by Olexa on 13.04.2016.
 */
var express = require('express');
var app = express();
var mongoose = require('mongoose');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');

mongoose.connect('mongodb://elifuser:qwerty12@ds015710.mlab.com:15710/elifbankdb');

app.use(express.static(__dirname + '/public'));
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({'extended':'true'}));
app.use(bodyParser.json());
app.use(bodyParser.json({type: 'application/vnd.api+json'}));
app.use(methodOverride());

var Account = mongoose.model('Account', {
    login : String,
    password : String,
    amount : Number
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

app.post('api/accounts', function(req, res)
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
            res.json(todos);
        });
    });
});

app.get('*', function(req, res) {
    res.sendfile('./public/index.html');
});

app.listen(8080);
console.log("App listening on port 8080");