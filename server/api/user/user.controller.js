'use strict';

var User = require('./user.model'),
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
    console.log(req.query.names);
    User.find({username:new RegExp('^'+req.query.names,'i')},{_id:false, hashedPassword:false, salt:false, __v:false, contacts:false },function(error, documents){
        if(error) throw error;
        if(documents){
            res.json({'contacts':documents});
        }else{
            next();
        }
    })
};