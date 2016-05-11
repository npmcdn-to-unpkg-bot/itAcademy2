var express = require('express');
var app = express();

var request = require('request');

var passport = require('passport');
var mongoose = require('mongoose');
var LocalStrategy = require('passport-local').Strategy;

var Admin = require('../models/admin.js');

var session = require('express-session');
var MongoAdmin = require('connect-mongo')(session);


// var Store = require('../models/store.js');
// var ItemSet = require('../../store/models/itemSet.js');
// var Item = require('../../store/models/item.js');
// var Transaction = require('../../store/models/transaction.js');

module.exports = function(app) {
    app.use(session({
        admin: new MongoAdmin({
            url: 'mongodb://admin:admin@ds019940.mlab.com:19940/elif_store'
        }),
        secret: 'garden',
        resave: true,
        saveInitialized: true
    }));

    app.use(passport.initialize());

    passport.use(new LocalStrategy({
        usernameField: 'name',
        passportField: 'password'
    }, function(username, password, done) {
        Admin.findOne({name: username}, function (err, user) {
            if(err)
                return done(err);
            if(!user)
                return done(null, false, {alert: 'Incorrect username!'});
            if(user.password != password)
                return done(null, false, {alert: 'Incorrect password!'});
            return done(null, user)
        });
    }));

    password.serializeUser(function(user, done) {
        Admin.findById(id, function(err, user) {
            // console.log(user);
            done(err, user);
        });
    });

    app.post('/admin_login', function(req, res) {
        var appRes = res;
        var admin = new Admin();
        admin.storeId = req.body.storeId,
        admin.name = req.body.name,
        admin.password  = req.body.password,
        admin.class = 'store-admin'

        request({
            header: {'content-type' : 'application/x-www-form-urlencoded'},
            method: 'POST',
            uri: 'http://localhost:3001/api/accounts',
            form: {
                login: admin.email,
                password: admin.password
            }
        }, function(err, res, body) {
            if(err)
                return console.log(err);

            admin.save(function(err) {
                if (err)
                    res.json({'alert': 'Something went wrong!'});
                else
                    res.send(admin);
            });
        });
    });

    app.get('/logout', function(req, res) {
        console.log('Logout');
        req.logout();
        res.sendStatus(200);
    });

    app.get('store/:id/admin/products', function(req, res) {
        var storeId = req.params.id;
        res.render('admin/products');
    });
};