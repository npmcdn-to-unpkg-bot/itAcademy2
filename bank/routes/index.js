var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var guid = require('../guidGenerator');
var Promise = require('bluebird');
var Account = require('../models/account');
var Transaction = require('../models/transaction');


//var isAuthenticated = function (req, res, next) {
//    // if user is authenticated in the session, call the next() to call the next request handler
//    // Passport adds this method to request object. A middleware is allowed to add properties to
//    // request and response objects
//    if (req.isAuthenticated())
//        return next();
//    // if the user is not authenticated then redirect him to the login page
//    res.redirect('/');
//}

module.exports = function() {

    router.post('/api/login', function (req, res)
    {
        Account.findOne({ 'login': req.body.login, 'password': req.body.password},
        function(err, account) {
            if(err)
            {
                res.send(err);
            }
            res.json(account);
        });
    });

    //returns number of accounts
    router.get('/api/accounts', function(req, res)
    {
        Account.find(function(err, accounts) {
            if(err)
            {
                res.send(err);
            }
            res.json(accounts.length);
        });
    });

    //router.get('/api/transfer', function(req, res){
    //    res.render('transfer', {account: req.account });
    //});

    //get users operation for home page
    router.post('/api/operations', function(req, res)
    {
        console.log(req.body);
        var operations = [];
        Promise.all([
            Transaction.find({'source': req.body.login}, function(err, transactions) {
                console.log('tip1');
               operations = transactions.map(function(transaction) {
                   return transaction;
               });

            }),
            Transaction.find({'destination': req.body.login}, function(err, transactions) {
                console.log('tip3');
                operations = transactions.map(function(transaction) {
                    return transaction;
                });
            })
        ]).then(function(){
            console.log(operations);
            res.json(operations);
        });
    });

    // removed isAuthenticated and changed 1st Account.update 'login' to req.body.source
    router.post('/api/transfer', function(req, res){
        //generate token for transaction
        var token = guid.Guid();
        var correct = true;
        var accAmount = 0;
        Promise.all([
            //check if source exists
            Account.findOne({ 'login': req.body.source}, function(err, account) {
                console.log(account);
                accAmount = account.amount;
                if(account == null) {
                    correct = false;
                    res.json({
                        success: false,
                        message: "Source account haven't found"
                    })
                }
                if((account.amount - req.body.amount) < 0) {
                    correct = false;
                    res.json({
                        success: false,
                        message: "Not enough founds"
                    })
                }
            }),
            //check if destinations exists
            Account.findOne({ 'login': req.body.destination}, function(err, account) {
                console.log(account);
                if(account == null) {
                    correct = false;
                    res.json({
                        success: false,
                        message: "Destination account haven't found"
                    })
                }
            })
        ]).then(function() {
            //get money from source
            if(correct) {
                return Account.update({
                    'login': req.body.source,
                    'password': req.body.password
                }, {$inc: {'amount': -req.body.amount}})
            }
            return false;
        })
        .then(function() {
                //give money to destinator
            if (correct) {
                return Account.update({'login': req.body.destination},
                {$inc: {'amount': req.body.amount}});
            }
            return false;
        })
        .then(function() {
                if(correct) {
                    return Transaction.create({
                        token: token,
                        time: Date.now(),
                        source: req.body.source,
                        destination: req.body.destination,
                        amount: req.body.amount
                    });
                }
                return false;
        })
        .then(function () {
                accAmount = accAmount - req.body.amount;
                res.json({
                success: true,
                message: "good",
                token: token,
                amount: accAmount
            });
        })
        .catch(function (err) {
            console.log(err.stack);
            res.json({
                success: false,
                message: "server err"
            });
        })
    });

    router.post('/transfer', function(req, res){
        //generate token for transaction
        var source_id = mongoose.Types.ObjectId(req.body.source);
        var destination_id = mongoose.Types.ObjectId(req.body.destination);
        var token = guid.Guid();
        var correct = true;
        Promise.all([
            //check if source exists
            Account.findOne({ '_id': source_id}, function(err, account) {
                console.log(account);
                if(account == null) {
                    correct = false;
                    res.json({
                        success: false,
                        message: "Source account haven't found"
                    })
                }
                if((account.amount - req.body.amount) < 0) {
                    correct = false;
                    res.json({
                        success: false,
                        message: "Not enough founds"
                    })
                }
            }),
            //check if destinations exists
            Account.findOne({ '_id': destination_id}, function(err, account) {
                console.log(account);
                if(account == null) {
                    correct = false;
                    res.json({
                        success: false,
                        message: "Destination account haven't found"
                    })
                }
            })
        ]).then(function() {
            if(correct) {
                return Account.update({
                    '_id': source_id,
                    'password': req.body.password
                }, {$inc: {'amount': -req.body.amount}})
            }
            return false;
        })
            .then(function() {
                if (correct) {
                    return Account.update({'_id': destination_id}, {$inc: {'amount': req.body.amount}});
                }
                return false;
            })
            .then(function() {
                if(correct) {
                    return Transaction.create({
                        token: token,
                        time: Date.now(),
                        source: req.body.source,
                        destination: req.body.destination,
                        amount: req.body.amount
                    });
                }
                return false;
            })
            .then(function () {
                res.json({
                    success: true,
                    message: "good",
                    token: token
                });
            })
            .catch(function (err) {
                console.log(err.stack);
                res.json({
                    success: false,
                    message: "server err"
                });
            })
    });

    router.post('/api/getMoney', function(req, res) {
        var token = guid.Guid();

        Promise.all([
            Account.update({
                'login': req.body.login
            }, {$inc: {amount: 500}}),
            Transaction.create({
                'token': token,
                'time': Date.now(),
                'source': 'salary',
                'destination': req.body.login,
                'amount': 500
            })

        ]).then(Account.findOne({'login': req.body.login}, function (err, account) {
            if (err) {
                res.send(err);
            }
            res.json(account);
        }));
    });

    //Account.findOne({ 'login': req.body.login, 'password': req.body.password},
    //    function(err, account) {
    //        if(err)
    //        {
    //            res.send(err);
    //        }
    //        res.json(account);
    //    });

    router.get('/api/checkOperation', function(req, res)
    {
        Transaction.findOne({
            token: req.body.token,
            source: req.body.source,
            destination: req.body.destination,
            amount: req.body.amount
        }, function(err, operation){
            if(err)
            {
                res.send(err);
            }
            if(operation == null){
                res.json({success: false});
            }
            else
            res.json({success: true});
        })
    });

    router.post('/api/accounts', function(req, res)
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
                res.json(accounts.length);
            });
        });
    });

    router.delete('/api/accounts/:account_id', function(req, res)
    {
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
    })

    //router.get('/home', isAuthenticated, function(req, res){
    //    res.render('home', {user: req.account });
    //    });
    ////
    ////router.get('/signout', function(req, res) {
    ////    req.logout();
    ////    res.redirect('/');
    ////});



    router.all('*', function(req, res, next) {
        // Just send the index.html for other files to support HTML5Mode
        res.sendFile('index.html', { root:  __dirname + '/../public' });
    });

    return router;
}
