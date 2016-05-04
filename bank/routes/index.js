var express = require('express');
var router = express.Router();
var guid = require('../guidGenerator');
var Promise = require('bluebird');
var User = require('../models/user');
var Transaction = require('../models/transaction');
var mongoose = require('mongoose');

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

    router.get('/', function(req, res) {
        res.render('index', {message: req.flash('message') });
    });

    router.post('/login', passport.authenticate('login', {
        successRedirect: '/home',
        failureRedirect: '/',
        failureFlash: true
    }));

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
        res.render('register',{message: req.flash('message')});
    });

    router.post('/signup', passport('sugnup', {
        successRedirect: '/home',
        failureRedirect: '/signup',
        failureFlash: true
    }));

    router.get('/transfer', isAuthenticated, function(req, res){
        res.render('transfer', {account: req.account });
    });

    router.post('/transfer', isAuthenticated, function(req, res){
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

    router.get('/home', isAuthenticated, function(req, res){
        res.render('home', {user: req.account });
    });

    router.get('/signout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    return router;
}