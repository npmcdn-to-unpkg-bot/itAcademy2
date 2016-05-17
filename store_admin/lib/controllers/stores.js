'use strict';

var mongoose = require('mongoose'),
  Store = mongoose.model('Store'),
  passport = require('passport'),
  ObjectId = mongoose.Types.ObjectId;

/**
 * Create store
 * requires: {storename, password, email}
 * returns: {email, password}
 */
exports.create = function (req, res, next) {
  var newStore = new Store(req.body);
  newStore.provider = 'local';

  newStore.save(function(err) {
    if (err) {
      return res.json(400, err);
    }

    req.logIn(newStore, function(err) {
      if (err) return next(err);
      return res.json(newStore.user_info);
    });
  });
};

/**
 *  Show profile
 *  returns {storename, profile}
 */
exports.show = function (req, res, next) {
  var userId = req.params.userId;

  Store.findById(ObjectId(userId), function (err, user) {
    if (err) {
      return next(new Error('Failed to load Store'));
    }
    if (user) {
      res.send({storename: user.storename, profile: user.profile });
    } else {
      res.send(404, 'USER_NOT_FOUND')
    }
  });
};

/**
 *  storename exists
 *  returns {exists}
 */
exports.exists = function (req, res, next) {
  var storename = req.params.storename;
  Store.findOne({ storename : storename }, function (err, user) {
    if (err) {
      return next(new Error('Failed to load Store ' + storename));
    }

    if(user) {
      res.json({exists: true});
    } else {
      res.json({exists: false});
    }
  });
}
