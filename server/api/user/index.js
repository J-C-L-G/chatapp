'use strict';

var express = require('express'),
    controller = require('./user.controller'),
    config = require('../../config/environment');

var router = express.Router();

/*** ..:: Register the User Routes ::.. ***/

//Handler to create a User
router.post('/',controller.create);

module.exports = router;