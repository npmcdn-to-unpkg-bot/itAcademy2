var express = require('express');
var router = express.Router();
var passport = require('passport');

var Store = require('../models/store.js');


router.post('/register', function(req, res) {
  Store.register(new Store({ storename: req.body.storename }),
    req.body.password, function(err, account) {
    if (err) {
      return res.status(500).json({
        err: err
      });
    }
    passport.authenticate('local')(req, res, function () {
      return res.status(200).json({
        status: 'Registration successful!'
      });
    });
  });
});

router.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, store, info) {
    if (err) {
      return next(err);
    }
    if (!store) {
      return res.status(401).json({
        err: info
      });
    }
    req.logIn(store, function(err) {
      if (err) {
        return res.status(500).json({
          err: 'Could not log in store'
        });
      }
      res.status(200).json({
        status: 'Login successful!'
      });
    });
  })(req, res, next);
});

router.get('/logout', function(req, res) {
  req.logout();
  res.status(200).json({
    status: 'Bye!'
  });
});

router.get('/status', function(req, res) {
  if (!req.isAuthenticated()) {
    return res.status(200).json({
      status: false
    });
  }
  res.status(200).json({
    status: true
  });
});


module.exports = router;