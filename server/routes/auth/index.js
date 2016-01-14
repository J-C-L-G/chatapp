'use strict';

var express = require('express'),
    passport = require('passport'),
    config = require('../../config/environment'),
    User = require('../../api/user/user.model');

//Passport Configuration
require('./local/passport').setup(User, config);

//Append routes to the router
var router = express.Router();

router.use('/local',require('./local'));

/*** ..:: Exports ::.. ***/
module.exports = router;