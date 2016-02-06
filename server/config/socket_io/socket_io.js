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
    });

    socket.on('logout',function(data){
        console.log(data);
        onDisconnect(socket);
        console.log('DISCONNECTED: '+socket.id);
    });

    socket.on('messageSent',function(data){

        User.findOne({'username': data.to  }, // ..:: Query to be Executed ::..
                     '_id')
            .exec(function(error, contact){

                User.findOne({'_id': socket.decoded_token._id, contacts: { _id : contact._id } }, // ..:: Query to be Executed ::..
                    '_id')                                                          // ..:: Restrictions to be returned ::..
                    .exec(function (error, userMatchingFound) {                               // ..:: Procedure to be Executed ::..
                        if(userMatchingFound){
                            data.event = 'messageReceived';
                            User.socket.notify(contact._id, data);
                        }
                    });

            });
    });

    //Reply from the backend to the client
    socket.emit('authenticated',true);
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