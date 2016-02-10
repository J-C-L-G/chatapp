'use strict';

var express = require('express'),
    passport = require('passport'),
    authService = require('../auth.service');

var router = express.Router();

router.post('/login',function(req, res, next){
    passport.authenticate('local', function(err, user, info){
        var error = err || info;
        if(error) return res.status(401).json(error);
        if(!user) return res.status(404).json({message: 'Something went wrong, please try again.'});

        //If everything was successful
        var token = authService.signToken(user._id);

        var activeUser = {
            username : user.username,
            email : user.email,
            motto : user.motto,
            contacts : user.contacts,
            pendingContacts : user.pendingContacts,
            groups : user.groups,
            notifications : user.notifications
        };
        res.json({'token':token, 'activeUser':activeUser});
    })(req, res, next);
});

/*** ..:: Exports ::.. ***/
module.exports = router;