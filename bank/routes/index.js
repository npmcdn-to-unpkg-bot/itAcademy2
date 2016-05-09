var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var guid = require('../guidGenerator');
var Promise = require('bluebird');
var Account = require('../models/account');
var Transaction = require('../models/transaction');


var isAuthenticated = function (req, res, next) {
    // if user is authenticated in the session, call the next() to call the next request handler
    // Passport adds this method to request object. A middleware is allowed to add properties to
    // request and response objects
    if (req.isAuthenticated())
        return next();
    // if the user is not authenticated then redirect him to the login page
    res.redirect('/');
}

module.exports = function(passport) {

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

    router.get('/api/accounts', function(req, res)
    {
        Account.find(function(err, accounts) {
            if(err)
            {
                res.send(err);
            }
            res.json(accounts);
        });
    });

    router.get('/api/checkBalance', function(req, res)
    {
        Account.findOne({ 'login': req.body.login, 'password': req.body.password},
            function(err, account) {
                if(err)
                {
                    res.send(err);
                }
                res.json(account);
            });
    })

    router.post('/salary', isAuthenticated, function(req,res) {
        var token = guid.Guid();
        var currentAccount = req.account;
        Promise.all([Account.update({login: req.account.login}, {$inc: {amount: 500}}),
        Transaction.create({token: token,
        time: Date.now(),
        source: 'salary',
        destination: currentAccount.login,
        amount: 500})
        ]).then(function() {
            console.log('tip2');
        });
    });

    router.get('/signup', function(req, res){
        res.render('signup',{message: req.flash('message')});
    });

    router.post('/signup', passport.authenticate('signup', {
        successRedirect: '/home',
        failureRedirect: '/signup',
        failureFlash: true
    }));

    router.get('/api/transfer', isAuthenticated, function(req, res){
        res.render('transfer', {account: req.account });
    });

    //get users operation for home page
    router.get('/api/operations', isAuthenticated, function(req, res)
    {
        var operations = [];
        Promise.all([
            //Transaction.find({'source': req.account.login}),
            //Transaction.find({'destination': req.account.login})
        ]);
    });

    router.post('/api/transfer', isAuthenticated, function(req, res){
        var token = guid.Guid();
        var currentAccount = req.account;
        Promise.all([
            Account.update({'login': currentAccount.login, 'password': req.body.password}, {$inc: {amount: -req.body.amount}}),
            Account.update({'login': req.body.destination}, { $inc: {mount: req.body.amount}})
        ]).then(function() {
            return Transaction.create({
                token: token,
                time: Date.now(),
                source: req.body.source,
                destination: req.body.destination,
                amount: req.body.amount
            });
        }).then(function () {
            res.json({
                success: true,
                message: "good",
                token: token
            });
        }).catch(function (err) {
            console.log(err.stack);
            res.send({
                success: false,
                message: "server err"
            });
        })
    });

    router.post('/api/getMoney', function(req, res) {
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

    router.get('/api/checkOperation', function(req, res)
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
                res.json(accounts);
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
    //});
    //
    //router.get('/signout', function(req, res) {
    //    req.logout();
    //    res.redirect('/');
    //});

    router.all('*', function(req, res, next) {
        // Just send the index.html for other files to support HTML5Mode
        res.sendFile('index.html', { root:  __dirname + '/../public' });
    });

    return router;
}