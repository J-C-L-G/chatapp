'use strict';

var mongoose = require('mongoose'),
    passport = require('passport'),
    /* JSON Web Token (JWT) is a compact token format intended for space constrained environments such as HTTP Authorization headers and URI query parameters. */
    jwt = require('jsonwebtoken'),
    /* Middleware that validates JsonWebTokens and sets req.user. */
    expressJwt = require('express-jwt'),
    /* Treat a sequence of middleware as a single middleware. */
    compose = require('composable-middleware'),

    config = require('../../config/environment'),
    User = require('../../api/user/user.model'),

    validateJwt = expressJwt({secret : config.secrets.session});

/******************************************************************
 * Attaches the user object to the request if authenticated       *
 * Otherwise return - 403 Forbidden HTTP status code              *
 ******************************************************************/

function isAuthenticated(){
    return compose()
        //Validate JsonWebToken
        .use(function(req, res, next){
            //Allow access_token to be passed through query parameter as well
            if(req.query && req.query.hasOwnProperty('access_token')){
                req.headers.authorization = 'Bearer ' + req.query.access_token;
            }

            /********************************************************************************
             * The JWT authentication middleware authenticates callers using a JWT.         *
             * If the token is valid, req.user will be set with the JSON object "user"      *
             * decoded to be used by later middleware for authorization and access control. *
             ********************************************************************************/
            validateJwt(req, res, next);
        })
        //Attach user to request
        .use(function(req, res, next){
            User.findById(req.user._id, 'profile', function(error, user){
                //If there was an error while querying the database
                if(error) return next(error);
                //If the user was not found in the database
                if(!user) return res.status(401).send('Unauthorized');
                //Else
                req.user = user;
                next();
            });
        });
}

/************************************************************************
 * Check if the user role meets the minimum requirements for the route  *
 ************************************************************************/

function hasRole(roleRequired){
    if(!roleRequired) throw new Error('Required role needs to be set');
    return compose()
        .use(isAuthenticated())
        .use(function meetsRequirements(req, res, next){
            if(config.userRoles.indexOf(req.user.role) >= config.userRoles.indexOf(roleRequired)){
                next();
            }else{
                res.status(403).send('Forbidden');
            }
        });
}

/******************************************************************
 * Returns a JsonWebToken signed by the app secret                *
 ******************************************************************/

function signToken(id){
    return jwt.sign( {_id:id},
                     config.secrets.session,
                     {expiresIn: 30 * 60} );
}

/******************************************************************
 * Set token cookie directly for oAuth strategies                 *
 ******************************************************************/
function setTokenCookie(req, res){
    //If the user object is not in the request object
    if (!req.user) return res.status(404).json({ message: 'Something went wrong, please try again.'});

    var token = signToken(user._id);
    res.cookie('token',JSON.stringify(token));
    res.redirect('/');
}

/*** ..:: Exports ::.. ****/
exports.isAuthenticated = isAuthenticated;
exports.hasRole = hasRole;
exports.signToken = signToken;
exports.setTokenCookie = setTokenCookie;