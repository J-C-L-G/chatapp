/************************************************
 * Socket.io Configuration File                 *
 ************************************************/

'use strict';

var config = require('../environment'),
    socketioJwt = require('socketio-jwt'),
    User = require('../../api/user/user.model');

/*************************************************
 * When user disconnects perform this action     *
 *************************************************/
function onDisconnect(socket){
    socket.leave((socket.decoded_token._id).toString());
}

/**************************************************
 * When the user Connects perform this action     *
 **************************************************/
function onConnect(socket){

    //Join the a new Room with the Specified User ID
    socket.join((socket.decoded_token._id).toString()); // Join a room with the user._id
    socket.leave(socket.id); // Leave the default room socket.id

    //Set the socket connection time.
    socket.connectedAt = new Date();

    //Call on Disconnect to subscribe in this event
    socket.on('disconnect',function(){
        onDisconnect(socket);
        console.log('DISCONNECTED: '+socket.id);
    });

    socket.on('login',function(data){
        console.log(data);
        for(var index in data.contactsToNotify ){
            User.socket.notify(data.contactsToNotify[index]._id, {event : data.event, message: data.username + ' is online'});
        }
    });

    socket.on('logout',function(data){
        console.log(data);
        for(var index in data.contactsToNotify ){
            User.socket.notify(data.contactsToNotify[index]._id, {event : data.event, message: data.username + ' is offline'});
        }
        onDisconnect(socket);
        console.log('DISCONNECTED: '+socket.id);
    });

    socket.on('messageSent',function(data){
        data.event = 'messageReceived';
        User.socket.notify(data.to, data);
    });

    //Reply from the backend to the client
    socket.emit('authenticated','Your Socket ID:'+ socket.id);

    //socket.on('contactRequest',function(data){
    //    //clientSockets[data.to].emit('receivedFriendRequest','Friend Request from ' + data.from);
    //    console.log(data);
    //    socket.broadcast.to(data.to).emit(data.type,
    //        {
    //            type: data.type,
    //            message : 'Contact Request from ' + data.from.username,
    //            from: data.from
    //        }
    //    );
    //});
}


/*** ..:: Export the Function to Setup the Socket Functionality ::.. ***/
module.exports = function(socket_io){
    // set authorization for socket.io
    socket_io.sockets
        .on('connection', socketioJwt.authorize({
            secret: config.secrets.session,
            timeout: 15000 // 15 seconds to send the authentication message
        }))
        .on('authenticated', function(socket) {
            /*** This socket is authenticated, we are good to handle more events from it. ***/
            //Call onConnect to perform this action
            onConnect(socket);
            console.log(socket.decoded_token._id +' CONNECTED: '+socket.id);
        });
};