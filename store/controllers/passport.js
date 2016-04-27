var config = require('../config');
var passport = require('passport');
var mongoose = require('mongoose');
var LocalStrategy = require('passport-local').Strategy;

var User = require('../models').User;

var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

module.exports = function(app) {

  app.use(session({
    store: new MongoStore({
      url: config.dbConnection
    }),
    secret: 'alexistheking',
    resave: true,
    saveUninitialized: true
  }));

  app.use(passport.initialize());

  passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  }, function (username, password, done) {

      User.findOne({email: username}, function (err, user) {

        if (err) {
          return done(err);
        }
        if (!user) {
          return done(null, false, {alert: 'Incorrect username.'});
        }
        if (user.password != password) {
          return done(null, false, {alert: 'Incorrect password.'});
        }
        return done(null, user);
      });
    }
  ));

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });


  app.post('/api/login_user', function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
      if (err) { return next(err); }
      if (!user) { return res.status(400).send({error: 'User not found'}) }
      req.logIn(user, function(err) {
        if (err) { return next(err); }
        return res.send(user);
      });
    })(req, res, next);
  });

  app.post('/api/add_user', function(req, res) {
    var user = new User();
    user.storeId = req.body.storeId,
		user.name = req.body.name,
		user.surname = req.body.surname,
		user.email = req.body.email,
		user.password = req.body.password,
		user.class = 'registered'

    user.save(function (err) {
      if (err) {
        res.json({'alert': 'Registration error.'})
      } else {
        res.send(user);
      };
    });
  });

  app.get('/api/logout', function(req, res) {
    console.log('logout');
    req.logout();
    res.sendStatus(200);
  });

}
