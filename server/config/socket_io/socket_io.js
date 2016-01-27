/************************************
 * Socket.io Configuration File     *
 ************************************/

'use strict';

var config = require('../environment'),
    socketioJwt = require('socketio-jwt');

var clientSockets = {};

/**
 * When the user connects perform this action
 */
function onConnect(socket){

    //When the client emmits info, this listen and executes
    socket.on('info',function(data){
        console.log('info executed from: ' + socket.id);
    });

    //Inserts sockets below
}

/**
 * When user disconnects perform this action
 */
function onDisconnect(socket){
    socket.leave((socket.decoded_token._id).toString());
    console.log('Socket disconnected');
}

/**
 *
 * @param socket_io
 */
function onFriendRequest(socket){

}

module.exports = function(socket_io){


    // set authorization for socket.io
    socket_io.sockets
        .on('connection', socketioJwt.authorize({
            secret: config.secrets.session,
            timeout: 15000 // 15 seconds to send the authentication message
        }))
        .on('authenticated', function(socket) {
            //this socket is authenticated, we are good to handle more events from it.
            console.log('hello! ' ,socket.decoded_token.username);
            socket.connectedAt = new Date();

            //Call on Disconnect to subscribe in this event
            socket.on('disconnect',function(){
                onDisconnect(socket);
                console.log('DISCONNECTED: '+socket.id);
            });

            socket.on('contactRequest',function(data){
                //clientSockets[data.to].emit('receivedFriendRequest','Friend Request from ' + data.from);
                console.log(data);
                socket.broadcast.to(data.to).emit(data.type,
                                                  {
                                                    type: data.type,
                                                    message : 'Contact Request from ' + data.from.username,
                                                    from: data.from
                                                  }
                );
            });

            //Call onConnect to perform this action
            onConnect(socket);
            console.log(socket.decoded_token.username +' CONNECTED: '+socket.id);

            socket.emit('authenticated','Your CID:'+ socket.id);

            socket.join((socket.decoded_token._id).toString());
            //clientSockets[socket.decoded_token.username] = socket;

        });

};