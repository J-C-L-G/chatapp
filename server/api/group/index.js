'use strict';

var express = require('express'),
    controller = require('./group.controller'),
    config = require('../../config/environment'),
    auth = require('../../routes/auth/auth.service');

var router = express.Router();

/*** ..:: Register the Group Routes ::.. ***/

//Handler to create a Group
router.post('/createGroup', auth.isAuthenticated() ,controller.createGroup);
router.post('/exitGroup', auth.isAuthenticated() ,controller.exitGroup);

module.exports = router;