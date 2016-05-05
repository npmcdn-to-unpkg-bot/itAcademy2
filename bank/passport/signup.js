var LocalStrategy   = require('passport-local').Strategy;
var User = require('../models/account');
var bCrypt = require('bcrypt-nodejs');

module.exports = function(passport){

    passport.use('signup', new LocalStrategy({
                passReqToCallback : true // allows us to pass back the entire request to the callback
            },
            function(req, login, password, done) {

                findOrCreateUser = function(){
                    // find a user in Mongo with provided username
                    Account.findOne({ 'login' :  login }, function(err, account) {
                        // In case of any error, return using the done method
                        if (err){
                            console.log('Error in SignUp: '+err);
                            return done(err);
                        }
                        // already exists
                        if (account) {
                            console.log('User already exists with username: '+login);
                            return done(null, false, req.flash('message','User Already Exists'));
                        } else {
                            // if there is no user with that email
                            // create the user
                            var newUser = new Account();

                            // set the user's local credentials
                            newUser.login = login;
                            newUser.password = createHash(password);
                            newUser.amount = 0;

                            // save the user
                            newUser.save(function(err) {
                                if (err){
                                    console.log('Error in Saving user: '+err);
                                    throw err;
                                }
                                console.log('User Registration successful');
                                return done(null, newUser);
                            });
                        }
                    });
                };
                // Delay the execution of findOrCreateUser and execute the method
                // in the next tick of the event loop
                process.nextTick(findOrCreateUser);
            })
    );

    // Generates hash using bCrypt
    var createHash = function(password){
        return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
    }

};