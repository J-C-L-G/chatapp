/*****************************
 * Main Application Routes   *
 *****************************/

'use strict';

var path = require('path');

module.exports = function(app, socket_io){

    /*** ..:: App Routes ::.. ****/
    //Auth routes
    app.use('/auth', require('./auth'));

    //User routes
    app.use('/api/users', require('../api/user'));
    //User socket
    require('../api/user/user.socket')(socket_io);

    //Group routes
    app.use('/api/group',require('../api/group'));

    // All other routes should redirect to the index.html
    app.route('/*')
        .get(function(req, res) {
            res.sendFile(path.resolve(app.get('appPath') + '/index.html'));
        });
};