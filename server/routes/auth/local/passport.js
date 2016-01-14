var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy;

exports.setup = function(User, config){
    passport.use(new LocalStrategy(
        {
            usernameField : 'username',
            passwordField : 'password' //Virtual Field
        },
        function(username, password, done){
            User.findOne({'username':username.toLowerCase()},function(error, user){
                //If there was an error while querying the database
                if(error) return done(error);
                //If the document was not found
                if(!user) return done(null, false, {message:'This username is not registered'});
                //If the user was found but the password is incorrect
                if(!user.authenticate(password)) return done(null, false, {message:'The password provided is not correct'});

                return done(null, user);
            });
        }
    ));
};