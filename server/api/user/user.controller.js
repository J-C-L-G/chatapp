'use strict';

var User = require('./user.model'),
    mongoose = require('mongoose'),
    passport = require('passport'),
    config = require('../../config/environment'),
    jwt = require('jsonwebtoken');


/**************************************
 * Utility Function                   *
 **************************************/

var validationError = function(res, error) {
    var errorList = [];
    for(var prop in error.errors){
        errorList.push(error.errors[prop].message)
    }
    return res.status(422).json({'errors':errorList});
};

/**
 * Creates a new user
 *
 * @return {webToken, userObject}
 */
exports.create = function(req, res, next){
    var newUser = new User(req.body);
    newUser.save(function(error, user){
        if(error) {
            return validationError(res, error);
        }
        var token = jwt.sign({_id : user._id},config.secrets.session,{expiresIn: 30});
        res.json({'token':token, 'newUser':user.profile});
    });
};

/**
 *Search for a Contact(s)
 *
 * @return {array}
 */

exports.find = function(req, res, next){
    var usernameToFind = new RegExp('^'+req.query.names,'i'),
        user = req.user;

    User.find({'username':{$regex:usernameToFind,$ne:user.username}}, //Query to be Executed
              {hashedPassword:false, salt:false, __v:false, contacts:false }, //Restrictions To Be Returned
              function(error, documents){ //Procedure
                if(error) throw error;
                if(documents){
                    res.json({'contactsFound':documents}); //Return documents matching the criteria
                }else{
                    res.json({'contactsFound':[]}); //Return an Empty Array
                }
              }
    );
};

/**
 * Add a contact to the user's pendindContacts array
 * until confirmation is received
 *
 * @return {array}
 */
exports.addContact = function(req, res, next){
    var user = req.user,
        contact = req.body.contact;

    //Add a Contact to the pendingContacts active user
    User.findOneAndUpdate(
        {_id: user._id},
        {$addToSet: {pendingContacts: contact._id}},
        {safe: true, upsert: true},
        function(error, userUpdated) {
            if(error) throw error;
            //If the contact was successfully added
            if(userUpdated){
                User.findOne({_id: user._id})
                    .populate({
                        path:'pendingContacts',
                        select:'_id username profileImage email'
                    })
                    .exec(function(error, userUpdatedWithpendingContactsUpdated) {
                        if (error) throw error;
                        res.json({'pendingContacts': userUpdatedWithpendingContactsUpdated.pendingContacts});
                    });
            }
        }
    );
};