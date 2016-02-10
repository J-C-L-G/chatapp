/************************************************
 * Socket.io Configuration File                 *
 ************************************************/

'use strict';

var config = require('../environment'),
    socketioJwt = require('socketio-jwt'),
    User = require('../../api/user/user.model'),
    Group = require('../../api/group/group.model');

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

    socket.on('messageSent',function(message){

        User.findOne({'username': message.to  },    // ..:: Query to be Executed ::..
                     '_id username')                // ..:: Restrictions to be returned ::..
            .exec(function(error, contact){         // ..:: Procedure to be Executed ::..
                if(error) throw error;
                //If the username was valid and the contact was found
                if(contact){
                    //We verify that the active user has this contact in his contact list.
                    User.findOne({'_id': socket.decoded_token._id, contacts: { _id : contact._id } },   // ..:: Query to be Executed ::..
                                 '_id username')                                                        // ..:: Restrictions to be returned ::..
                        .exec(function (error, user) {                                                  // ..:: Procedure to be Executed ::..
                            if(error) throw error;
                            //If the active user has this contact in his list, we send the message.
                            if(user){
                                message.event = 'messageReceived';
                                /**/
                                message.date = new Date();
                                message.chat = contact.username;
                                message.from = user.username;
                                User.socket.notify(user._id, message);
                                /**/
                                message.chat = user.username;
                                User.socket.notify(contact._id, message);
                            }
                        });

                }
            });

        /**** Groups ****/

        Group.findOne({'name': message.to  },   // ..:: Query to be Executed ::..
            '-_id name admin members')              // ..:: Restrictions to be returned ::..
            .populate({                         // ..:: Restriction on the returned properties ::..
                path: 'members',
                select: '_id username'
            })
            .exec(function(error, group){
                if(error) throw error;

                if(group){
                    User.findOne({'_id': socket.decoded_token._id},     // ..:: Query to be Executed ::..
                        '_id username')                                 // ..:: Restrictions to be returned ::..
                        .exec(function (error, user) {                  // ..:: Procedure to be Executed ::..
                            if(error) throw error;
                            //If the active user has this contact in his list, we send the message.
                            if(user){

                                group.members.forEach(function(member){
                                    message.event = 'messageReceived';
                                    /**************** *************************/
                                    message.date = new Date();
                                    message.chat = group.name;
                                    message.from = user.username;
                                    User.socket.notify(member._id, message);
                                    /**************** *************************/
                                });

                            }
                        });
                }
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