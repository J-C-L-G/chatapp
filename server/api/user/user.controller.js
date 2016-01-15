'use strict';

var User = require('./user.model'),
    passport = require('passport'),
    config = require('../../config/environment'),
    jwt = require('jsonwebtoken');


/**************************************
 * Utility Function                   *
 **************************************/

var validationError = function(res, err) {
    return res.status(422).json(err);
};

/**
 * Creates a new user
 *
 * @return {webToken, userObject}
 */
exports.create = function(req, res, next){
    var newUser = new User(req.body);
    newUser.save(function(error, user){
        if(error) return validationError(res, error);
        var token = jwt.sign({_id : user._id},config.secrets.session,{expiresIn: 60*5});
        res.json({'token':token, 'newUser':user.profile});
    });
};