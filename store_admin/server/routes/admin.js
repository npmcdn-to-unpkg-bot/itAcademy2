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
        admin: new N=M
    }))

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
        })
    }))

    app.get('store/:id/admin/products', function(req, res) {
        var storeId = req.params.id;
        res.render('admin/products');
    });
};