var login = require('./login');
var signup = require('./signup');
var User = require('../models/Account');

module.exports = function(passport){

    // Passport needs to be able to serialize and deserialize users to support persistent login sessions
    passport.serializeUser(function(account, done) {
        console.log('serializing user: ');console.log(account);
        done(null, account._id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, account) {
            console.log('deserializing user:',account);
            done(err, account);
        });
    });

    // Setting up Passport Strategies for Login and SignUp/Registration
    login(passport);
    signup(passport);

};