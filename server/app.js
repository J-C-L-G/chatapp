/*******************************
* Main Application File        *
*******************************/

'use strict';

/**** ..:: Requires ::.. ****/
var https = require('https'),
    http = require('http'),
    express = require('express'),
    mongoose = require('mongoose'),
    config = require('./config/environment');


/**** ..:: Connect to the DataBase ::.. ****/
mongoose.connect(config.mongo.uri, config.mongo.options);
mongoose.connection.on('error',function(error){
    console.log('MongoDB connection error: ' + error);
    process.exit(-1);
});


/**** ..:: Populate DB with Sample Data ::.. ****/
if(config.seedDB){ require('./config/seedDB/seed'); } //Needs to be completed


/*** ..:: Setup HTTP/S Server ::.. ****/
var app = express(),
    server;

    if(config.https){
        var sslConfig = require('./config/ssl/sslConfig');
        server = https.createServer(sslConfig,app);
    }else{
        server = http.createServer(app);
    }


/*** ..:: Setup Express Middleware ::.. ****/
require('./config/express/express')(app);


/*** ..:: TEMP-MIDDLEWARE for req.body ::.. ****/
app.use(function(req, res, next){
    if(req.body)
        console.log(req.body);
    next();
});


/*** ..:: Setup Routes in the Express App ::.. ****/
require('./routes/routes')(app);


/*** ..:: Start the Servers ::.. ***/
if(config.https){
    http.createServer(function (req, res) {
        res.writeHead(301, { "Location": "https://"+config.ip+":"+config.port});
        res.end();
    }).listen(80);
}

server.listen(config.port, config.ip, function(){
    console.log('Express server listening on %d, in %s mode', config.port, app.get('env'));
});


/*** ..:: Expose App as Module ::.. ****/
exports = module.exports = app;