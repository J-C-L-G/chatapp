/***
* File to setup the common configuration for the application
***/

'use strict';

/* ..:: Requires ::.. */
//- lodash is a module with built in functions
var _ = require('lodash'),
    path = require('path'),
    fs = require('fs'),
    os = require('os');

/*****************************************************
 * Get the local ip assigned                         *
 *****************************************************/
function getLocalIP(){
    var netInterfaces = os.networkInterfaces()['Wi-Fi'];
    var localIP = '127.0.0.1';
    if(netInterfaces){
        Object.keys(netInterfaces).forEach(function (index) {
            if (netInterfaces[index].family == 'IPv4' &&
                netInterfaces[index].internal == false) {
                localIP = netInterfaces[index].address;
            }
        });
    }
    return localIP;
}

// Default initial configuration
var defaultOptions = {
    //Environment where the Application is running
    env : process.env.NODE_ENV || 'development',

    //Root path of the server
    root : path.normalize(__dirname + '/../../..'),

    //Server port
    port : process.env.PORT || 5000,

    //Server Protocol
    https : process.env.HTTPS_ENABLED || true, //set to true to enable HTTPS protocol

    //Server IP
    ip : process.env.IP || '0.0.0.0', // will listen for all network interface
                                        // 127.0.0.1 - localhost - 0.0.0.0

    //Check the network interfaces and obtain the IP assigned by the Router
    localIp : getLocalIP() || '127.0.0.1',

    // List of user roles
    userRoles: ['guest', 'user', 'admin'],

    //Secret for Session
    secrets : {
        session : process.env.SECRET ||
                  fs.readFileSync('./config/environment/secretword.pem').toString() //secret file to build the tokens and sessions
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