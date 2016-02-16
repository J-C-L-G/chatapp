'use strict';

var express = require('express'),
    controller = require('./user.controller'),
    config = require('../../config/environment'),
    auth = require('../../routes/auth/auth.service');

var router = express.Router();

/*** ..:: Register the User Routes ::.. ***/

//Handler to create a User
router.post('/',controller.create);
router.get('/findContacts', auth.isAuthenticated(), controller.find);
router.post('/addContact',auth.isAuthenticated(),controller.addContact);
router.post('/confirmContact',auth.isAuthenticated(),controller.confirmContact);
router.post('/deleteContact',auth.isAuthenticated(),controller.deleteContact);
router.post('/rejectContact',auth.isAuthenticated(),controller.rejectContact);

module.exports = router;