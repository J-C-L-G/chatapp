/***
* File to setup the common configuration for the application
***/

'use strict';

/* ..:: Requires ::.. */
//- lodash is a module with built in functions
var _ = require('lodash'),
    path = require('path'),
    fs = require('fs');

// Default initial configuration
var defaultOptions = {
    //Environment where the Application is running
    env : process.env.NODE_ENV || 'development',

    //Root path of the server
    root : path.normalize(__dirname + '/../../..'),

    //Server port
    port : process.env.PORT || 5000,

    //Server Protocol
    https : false,

    //Server IP
    ip : process.env.IP || '0.0.0.0', // will listen for all network interface
                                      // 127.0.0.1 - localhost - 0.0.0.0

    // List of user roles
    userRoles: ['guest', 'user', 'admin'],

    //Secret for Session
    secrets : {
        session : process.env.SECRET || fs.readFileSync('./config/environment/secretword.pem')
    },

    // MongoDB connection options
    mongo: {
        options: {
            db: { safe: true }
        }
    },

    // API Keys to use with Everyauth module
    facebook : {
        FACEBOOK_CONSUMER_KEY : process.env.FACEBOOK_CONSUMER_KEY || '',
        FACEBOOK_CONSUMER_SECRET : process.env.FACEBOOK_CONSUMER_SECRET || ''
    },
    twitter : {
        TWITTER_CONSUMER_KEY : process.env.TWITTER_CONSUMER_KEY || '',
        TWITTER_CONSUMER_SECRET : process.env.TWITTER_CONSUMER_SECRET || ''
    }
};

//Export the config object based on the environment
module.exports = _.merge(
    defaultOptions,
    require('./'+defaultOptions.env+'.js' || {})
);