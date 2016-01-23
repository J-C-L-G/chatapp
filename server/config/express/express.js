/**************************************
 * Express Framework Configuration    *
 **************************************/

'use strict';

/* ..:: Requires ::.. */
var express = require('express'),
    /* Session data is not saved in the cookie itself, just the session ID. Session data is stored server-side. */
    session = require('express-session'),
    path = require('path'),
    config = require('../environment'),
    /* Node.js middleware for serving a favicon: A favicon is a visual cue that client software, like browsers, use to identify a site. */
    favicon = require('serve-favicon'),
    /* HTTP request logger middleware for Node.js */
    morgan = require('morgan'),
    /* Node.js compression middleware. - Requests that pass through the middleware will be compressed. */
    compression = require('compression'),
    /* BodyParser will populate the req.body property with the parsed body, or an empty object ({}) if there was no body to parse
    *  works with JSON, Raw , Text and URL encoded body parser. */
    bodyParser = require('body-parser'),
    /* Lets you use HTTP verbs such as PUT or DELETE in places where the client doesn't support it. */
    methodOverride = require('method-override'),
    /* Parse Cookie header and populate req.cookies with an object keyed by the cookie names. Optionally you may enable signed
    *  cookie support by passing a secret string, which assigns req.secret so it may be used by other middleware. */
    cookieParser = require('cookie-parser'),
    /* Create new middleware to handle errors and respond with content negotiation. This middleware is only intended to
       be used in a development environment, as the full error stack traces will be sent back to the client when an error occurs. */
    errorHandler = require('errorhandler'),
    /* Passport is Express-compatible authentication middleware for Node.js. */
    passport = require('passport'),
    /* MongoDB session store for Express and Connect */
    mongoStore = require('connect-mongo')(session),
    /* Mongoose MongoDB ODM */
    mongoose = require('mongoose'),
    /*EJS - Embedded JavaScript Templates <%= obj.prop %>*/
    ejs = require('ejs');


module.exports = function(app){
    var env = app.get('env'); // same as process.env.NODE_ENV

    app.set('views',config.root + '/server/views');
    app.engine('html',ejs.renderFile);
    app.set('view engine','html');
    app.use(compression());
    app.use(bodyParser.urlencoded({extended:false}));
    app.use(bodyParser.json());
    app.use(methodOverride());
    app.use(cookieParser());
    app.use(passport.initialize());

    //Persist sessions with MongoStore
    app.use(session({
        secret : config.secrets.session,
        resave : true,
        saveUninitialized : true,
        store : new mongoStore({
            mongooseConnection : mongoose.connection,
            db : 'chatapp-dev'
        })
    }));

    /* ..:: Specific Middleware Used for Specific Environment ::.. */
    if( env == 'production' ){
        app.use(favicon(path.join(config.root, 'public', 'favicon.ico')));
        app.use(express.static(path.join(config.root, 'client')));
        app.set('appPath', path.join(config.root, 'client'));
        app.use(morgan('dev'));
    }else if( env == 'development' ){
        app.use(express.static(path.join(config.root, 'client')));
        app.set('appPath', path.join(config.root, 'client'));
        app.use(morgan('dev'));
        app.use(errorHandler());
    }
};