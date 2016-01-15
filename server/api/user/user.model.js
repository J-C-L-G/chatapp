'use strict';

    /* Mongoose MongoDB ODM */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    /* The crypto module offers a way of encapsulating secure credentials to be used as part of a secure HTTPS net or http connection. */
    crypto = require('crypto');

var UserSchema = new Schema({
    username : {
        type : String,
        required: true,
        lowercase: true,
        match: /[A-Za-z0-9]+/
    },
    email : {
        type:String,
        required: true,
        lowercase: true,
        match: /^(|(([A-Za-z0-9]+_+)|([A-Za-z0-9]+\-+)|([A-Za-z0-9]+\.+)|([A-Za-z0-9]+\++))*[A-Za-z0-9]+@((\w+\-+)|(\w+\.))*\w{1,63}\.[a-zA-Z]{2,6})$/i
    },
    hashedPassword : {
        type: String,
        required: true
    },
    role : {
        type : String,
        default:'user'
    },
    motto:{
        type:String,
        default:'Hey! I"m using the ChatApp'
    },
    profileImage: {
        data: Buffer,
        contentType: String //https://gist.github.com/aheckmann/2408370
    },
    provider:{
        type:String,
        default:'local'
    },
    salt:String
});

/********************************************************
 * Virtual Fields                                       *
*********************************************************/

UserSchema
    .virtual('password')
    .set(function(password){
        this._password = password;
        this.salt = this.makeSalt();
        this.hashedPassword = this.encryptPassword(password);
    })
    .get(function(){
        return this._password;
    });

UserSchema
    .virtual('profile')
    .get(function(){
        return {
            '_id': this._id,
            'username'  : this.username,
            'email' : this.email,
            'motto' : this.motto,
            'profileImage' : this.profileImage,
            'role' : this.role
        }
    });

UserSchema
    .virtual('token')
    .get(function(){
        return {
            '_id': this._id,
            'role': this.role
        };
    });

/********************************************************
 * Validation Methods                                   *
 ********************************************************/

// 1.Empty username
UserSchema
    .path('username')
    .validate(function(username){
        return (username.length > 0);
    },'Username can not not be empty');

// 2.Empty email
UserSchema
    .path('email')
    .validate(function(email){
        return (email.length > 0);
    },'Email can not be empty');

// 3.Empty hashedPassword
UserSchema
    .path('hashedPassword')
    .validate(function(hashedPassword){
        return (hashedPassword.length > 0);
    },'Password can not be empty');

// 4.Verify if the username is not taken
UserSchema
    .path('username')
    .validate(function(value, respond){
        var self = this;
        this.constructor.findOne({username: value}, function(err, user) {
            if(err) throw err;
            if(user) {
                if(self.id === user.id) return respond(true);
                return respond(false);
            }
            respond(true);
        });
    }, 'The specified username address is already in use.');

// 5.Verify if the email is not taken
UserSchema
    .path('email')
    .validate(function(value, respond){
        var self = this;
        this.constructor.findOne({email: value}, function(err, user) {
            if(err) throw err;
            if(user) {
                if(self.id === user.id) return respond(true);
                return respond(false);
            }
            respond(true);
        });
    }, 'The specified email address is already in use.');


/********************************************************
* Utility Functions                                     *
*********************************************************/

 var validatePresenceOf = function(value) {
    return value && value.length;
};


 /********************************************************
 * Pre-Save Hook                                        *
 *                                                      *
 * Notes: isNew is an key used by mongoose internally.  *
 * Saving that value to the document's wasNew in the    *
 * pre-save hook allows the post save hook to know      *
 * whether this was an existing document or a newly     *
 * created one.                                         *
 *******************************************************/

UserSchema
    .pre('save', function(next) {
        if (!this.isNew) return next(); //Go to Save Hook

        if (!validatePresenceOf(this.hashedPassword))
            next(new Error('Invalid password'));
        else
            next(); //Go to Save Hook
    });

/********************************************************
* Schema Instance Methods                               *
*********************************************************/

UserSchema.methods = {
    /**
     * Authenticate - Check if the passwords are the same
     * @param {String} plainText
     * @return {Boolean}
     * @api public
     */
    authenticate : function(plainText){
        return this.encryptPassword(plainText) == this.hashedPassword;
    },

    /**
     * Make Salt - a salt is random data that is used as an additional
     * input to a one-way function that "hashes" a password or passphrase.
     *
     * @return {String}
     * @api public
     */
    makeSalt : function(){
        //A new salt is randomly generated for each password
        return crypto.randomBytes(16).toString('base64');
    },

    /**
     * Encrypt Password
     *
     * @param {String} password
     * @return {String}
     * @api public
     */
    encryptPassword : function(password){
        if(!password || !this.salt) return '';
        var salt = new Buffer(this.salt, 'base64');
        //Synchronous PBKDF2 function. Returns derivedKey or throws error.
        return crypto.pbkdf2Sync(password, salt, 10000, 64).toString('base64');
    }
};

module.exports = mongoose.model('User',UserSchema);