var LocalStrategy   = require('passport-local').Strategy;
var Account = require('../models/account');
var bCrypt = require('bcrypt-nodejs');

module.exports = function(passport){

    passport.use('login', new LocalStrategy({
                passReqToCallback : true
            },
            function(req, login, password, done) {
                // check in mongo if a user with username exists or not
                User.findOne({ 'login' :  login },
                    function(err, account) {
                        // In case of any error, return using the done method
                        if (err)
                            return done(err);
                        // Username does not exist, log the error and redirect back
                        if (!account){
                            console.log('User Not Found with username '+login);
                            return done(null, false, req.flash('message', 'User Not found.'));
                        }
                        // User exists but wrong password, log the error
                        if (!isValidPassword(account, password)){
                            console.log('Invalid Password');
                            return done(null, false, req.flash('message', 'Invalid Password')); // redirect back to login page
                        }
                        // User and password both match, return user from done method
                        // which will be treated like success
                        return done(null, account);
                    }
                );

            })
    );


    var isValidPassword = function(account, password){
        return password == account.password;
    }

}