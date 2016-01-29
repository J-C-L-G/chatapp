var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy;

exports.setup = function(User, config){
    passport.use(new LocalStrategy(
        {
            usernameField : 'username',
            passwordField : 'password' //Virtual Field
        },
        function(username, password, done){
            //Validate if the login
            User.findOne({'username':username.toLowerCase()},
                function(error, user){
                    //If there was an error while querying the database
                    if(error) return done(error);
                    //If the document was not found
                    if(!user) return done(null, false, {message:'This username is not registered'});
                    //If the user was found but the password is incorrect
                    if(!user.authenticate(password)) return done(null, false, {message:'The password provided is not correct'});

                    /*** ***/
                    //Populate the user with its references
                    User.findOne({_id: user._id},
                        '-hashedPassword -salt -__v -provider -role') //Restrictions from what is being returned
                        .populate({
                            path: 'contacts pendingContacts',
                            select: '_id username profileImage email'
                        })
                        .populate({
                            path: 'notifications',
                            select: '_id message from event'
                        })
                        .exec(function(error, userUpdatedWithRefs) {
                            if (error) throw error;

                            return done(null, userUpdatedWithRefs);
                        });
                    /*** ***/
                }
            );
        }
    ));
};