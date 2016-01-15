/*****************************
 * Main Application Routes   *
 *****************************/

'use strict';

var path = require('path');

module.exports = function(app){

    /*** ..:: App Routes ::.. ****/
    //Auth routes
    app.use('/auth', require('./auth'));
    //User routes
    app.use('/api/users', require('../api/user'));


    // All other routes should redirect to the index.html
    app.route('/*')
        .get(function(req, res) {
            res.sendFile(path.resolve(app.get('appPath') + '/index.html'));
        });
};