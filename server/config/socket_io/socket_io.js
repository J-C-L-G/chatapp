/************************************************
 * Socket.io Configuration File                 *
 ************************************************/

'use strict';

var config = require('../environment'),
    socketioJwt = require('socketio-jwt'),
    User = require('../../api/user/user.model'),
    Group = require('../../api/group/group.model'),
    _ = require('lodash');

/*************************************************
 * When user disconnects perform this action     *
 *************************************************/
function onDisconnect(socket) {
    socket.leave((socket.decoded_token._id).toString());
}

/**************************************************
 * When the user Connects perform this action     *
 **************************************************/
function onConnect(socket, socket_io) {
    //Join the a new Room with the Specified User ID
    socket.join((socket.decoded_token._id).toString()); // Join a room with the user._id
    socket.leave(socket.id); // Leave the default room socket.id

    //Set the socket connection time.
    socket.connectedAt = new Date();

    //Call on Disconnect to subscribe in this event
    socket.on('disconnect', function () {
        onDisconnect(socket);
        console.log('DISCONNECTED: ' + socket.id);

        //Notify the user's contacts when this user is offline
        var numOfSessions = 0;
        if(socket_io.sockets.adapter.rooms[socket.decoded_token._id]){
            numOfSessions = socket_io.sockets.adapter.rooms[socket.decoded_token._id].length;
        }
        if(numOfSessions == 0){
            User.findOne(
                {_id: socket.decoded_token._id},
                '-__v -salt -hashedPassword -role -provider -pendingContacts -notifications')
                .exec(function (error, user) {
                    var message = {
                        'event' : 'logout',
                        'message' : user.username + ' is offline.'
                    };
                    user.contacts.forEach(
                        function(contact_id){
                            User.socket.notify(contact_id, message);
                        }
                    );
                });
        }
    });

    socket.on('login', function() {
        var numOfSessions = 1;
        if(socket_io.sockets.adapter.rooms[socket.decoded_token._id]){
            numOfSessions = socket_io.sockets.adapter.rooms[socket.decoded_token._id].length;
        }
        if(numOfSessions == 1){
            User.findOne(
                {_id: socket.decoded_token._id},
                '-__v -salt -hashedPassword -role -provider -pendingContacts -notifications')
                .exec(function (error, user) {
                    var message = {
                        'event' : 'login',
                        'message' : user.username + ' is online.'
                    };
                    user.contacts.forEach(
                        function(contact_id){
                            User.socket.notify(contact_id, message);
                        }
                    );
                });
        }
    });

    socket.on('logout', function(){
        onDisconnect(socket);
        console.log('DISCONNECTED: ' + socket.id);

        //Notify the user's contacts when this user is offline
        var numOfSessions = 0;
        if(socket_io.sockets.adapter.rooms[socket.decoded_token._id]){
            numOfSessions = socket_io.sockets.adapter.rooms[socket.decoded_token._id].length;
        }
        if(numOfSessions == 0){
            User.findOne(
                {_id: socket.decoded_token._id},
                '-__v -salt -hashedPassword -role -provider -pendingContacts -notifications')
                .exec(function (error, user) {
                    var message = {
                        'event' : 'logout',
                        'message' : user.username + ' is offline.'
                    };
                    user.contacts.forEach(
                        function(contact_id){
                            User.socket.notify(contact_id, message);
                        }
                    );
                });
        }
    });

    socket.on('messageSent', function (message) {

        // Query to search for the active user
        // sending the message through the application.
        User.findOne(
            {_id: socket.decoded_token._id},
            '-__v -salt -hashedPassword -role -provider')
            .populate({
                path: 'contacts',
                select: '_id username'
            })
            .populate({
                path: 'groups',
                select: '_id name members'
            }).exec(function (error, user) {
                if (error) throw error;
                if (user) {
                    //Once we have the active user making the ws request
                    /*** One to One Conversation ***/
                    var contact = _.find(user.contacts, {'username':message.to});
                    //If the contact is in the user's contact list.
                    if (contact) {
                            /*** Create the message ***/
                            message.event = 'messageReceived';
                            message.date = new Date();
                            message.from = user.username;
                                /*** ..:: Notify to the active User ::.. ***/
                                message.chat = contact.username;
                                User.socket.notify(user._id, message);
                                /*** ..:: Notify the contact who will receive the message ::.. ***/
                                message.chat = user.username;
                                User.socket.notify(contact._id, message);
                    }
                    /*** Group Conversation ***/
                    else {
                        var group = _.find(user.groups, {'name':message.to});
                        //If the group's name exist in the chat list for this user.
                        if (group) {
                            /*** Create the message ***/
                                message.event = 'messageReceived';
                                message.date = new Date();
                                message.chat = group.name;
                                message.from = user.username;
                            /*** ..:: Notify to the group members ::.. ***/
                                group.members.forEach(
                                    function (id) {
                                        User.socket.notify(id, message);
                                    }
                                );
                            }
                        }
                    }
            });
    });

    //Reply from the backend to the client
    socket.emit('authenticated', true);
}


/*** ..:: Export the Function to Setup the Socket Functionality ::.. ***/
module.exports = function (socket_io) {
    // set authorization for socket.io
    socket_io.sockets
        .on('connection', socketioJwt.authorize({
            secret: config.secrets.session,
            timeout: 15000 // 15 seconds to send the authentication message
        }))
        .on('authenticated', function (socket) {
            /*** This socket is authenticated, we are good to handle more events from it. ***/
                //Call onConnect to perform this action
            onConnect(socket, socket_io);
            console.log(socket.decoded_token._id + ' CONNECTED: ' + socket.id);
        });
};
