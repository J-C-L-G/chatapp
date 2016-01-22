'use strict';

var express = require('express'),
    controller = require('./user.controller'),
    config = require('../../config/environment'),
    auth = require('../../routes/auth/auth.service');

var router = express.Router();

/*** ..:: Register the User Routes ::.. ***/

//Handler to create a User
router.post('/',controller.create);
router.get('/contacts', auth.isAuthenticated(), controller.find);

module.exports = router;