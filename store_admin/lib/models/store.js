'use strict';

var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  crypto = require('crypto');

var StoreSchema = new Schema({
  email: {
    type: String,
    unique: true,
    required: true
  },
  storename: {
    type: String,
    unique: true,
    required: true
  },
  hashedPassword: String,
  salt: String,
  name: String,
  admin: Boolean,
  guest: Boolean,
  provider: String
});

/**
 * Virtuals
 */
StoreSchema
  .virtual('password')
  .set(function(password) {
    this._password = password;
    this.salt = this.makeSalt();
    this.hashedPassword = this.encryptPassword(password);
  })
  .get(function() {
    return this._password;
  });

StoreSchema
  .virtual('user_info')
  .get(function () {
    return { '_id': this._id, 'storename': this.storename, 'email': this.email };
  });

/**
 * Validations
 */

var validatePresenceOf = function (value) {
  return value && value.length;
};

StoreSchema.path('email').validate(function (email) {
  var emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
  return emailRegex.test(email);
}, 'The specified email is invalid.');

StoreSchema.path('email').validate(function(value, respond) {
  mongoose.models["Store"].findOne({email: value}, function(err, user) {
    if(err) throw err;
    if(user) return respond(false);
    respond(true);
  });
}, 'The specified email address is already in use.');

StoreSchema.path('storename').validate(function(value, respond) {
  mongoose.models["Store"].findOne({storename: value}, function(err, user) {
    if(err) throw err;
    if(user) return respond(false);
    respond(true);
  });
}, 'The specified storename is already in use.');

/**
 * Pre-save hook
 */

StoreSchema.pre('save', function(next) {
  if (!this.isNew) {
    return next();
  }

  if (!validatePresenceOf(this.password)) {
    next(new Error('Invalid password'));
  }
  else {
    next();
  }
});

/**
 * Methods
 */

StoreSchema.methods = {

  /**
   * Authenticate - check if the passwords are the same
   */

  authenticate: function(plainText) {
    return this.encryptPassword(plainText) === this.hashedPassword;
  },

  /**
   * Make salt
   */

  makeSalt: function() {
    return crypto.randomBytes(16).toString('base64');
  },

  /**
   * Encrypt password
   */

  encryptPassword: function(password) {
    if (!password || !this.salt) return '';
    var salt = new Buffer(this.salt, 'base64');
    return crypto.pbkdf2Sync(password, salt, 10000, 64).toString('base64');
  }
};

mongoose.model('Store', StoreSchema);
