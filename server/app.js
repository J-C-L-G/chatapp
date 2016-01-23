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
    console.log('****************************************************')
    if(req.params){
        console.log('*********** ..:: req.params ::.. *************')
        console.log(req.params);
    }
    if(req.body){
        console.log('*********** ..:: req.body ::.. *************')
        console.log(req.body);
    }
    if(req.query){
        console.log('*********** ..:: req.query ::.. *************')
        console.log(req.query);
    }
    next();
});


/*** ..:: Setup Routes in the Express App ::.. ****/
require('./routes/routes')(app);


/*** ..:: Start the Server ::.. ***/
console.log('\n************ ...::::::::: SERVER INFORMATION ::::::::::::::... ************');
if(config.https){
    server.listen(config.port, config.localIp, function(){
        console.log('Express Server Listening  ' +
                    '\nPORT: %d ' +
                    '\nENVIRONMENT: %s ' +
                    '\nHTTPS: %s ', config.port,app.get('env'), config.https);
        console.log('\nhttps://'+config.localIp+':'+config.port);
    });
}else{
    server.listen(config.port, function(){
        console.log('Express Server Listening  ' +
                    '\nPORT: %d ' +
                    '\nENVIRONMENT: %s ' +
                    '\nHTTPS: %s ', config.port,app.get('env'), config.https);
        console.log('\nhttp://'+config.localIp+':'+config.port+'\n');
    });
console.log('************ ...:::::::::::::::::::::::::::::::::::::::::::... ************');
}


/*** ..:: Expose App as Module ::.. ****/
exports = module.exports = app;