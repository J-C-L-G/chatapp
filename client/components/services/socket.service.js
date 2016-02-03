angular.module('chatApp')
    .factory('Socket', ['Toast', '$rootScope', 'Sync','Messaging',
        function (Toast, $rootScope, Sync, Messaging) {

            //Variable to hold the reference to the socket
            var socket;

            function initialize(jwt) {
                //Initialize the socket variable
                socket = io.connect();

                socket.on('connect', function () {
                    /*** Events to be listening from the Sever Side ***/
                    socket
                        //Handler to authenticate the socket
                        .on('authenticated', function (data) {
                            if (data) {
                                //console.log(data);
                                //console.log(socket);
                            }
                        })
                        //Handler to notify when the user login
                        .on('login', function (data) {
                            Toast.notify(data.message);
                        })
                        //Handler to notify when the user logout
                        .on('logout', function (data) {
                            Toast.notify(data.message);
                        })
                        //Handler to manage when you add a contact
                        .on('contactRequest', function (data) {
                            Toast.notify(data.message);
                            $rootScope.$broadcast('TOGGLE_NOTIFICATIONS', data);
                        })
                        //Handler to manage when your contact request has been accepted/declined
                        .on('contactResponse', function (data) {
                            if (Sync.updateContacts(data.from)) {
                                Toast.notify(data.message);
                            }
                        })
                        //Handler to manage when the user sends a message
                        .on('messageSent', function(){
                        })
                        //Handler to manage when the user receives a message
                        .on('messageReceived', function(data) {
                            Toast.notify(data.message + ' from: ' + data.from);

                            console.log(data);
                            data.to = Sync.getContactUsername(data.to);
                            console.log(data);

                            Messaging.addMessage(data);
                        })

                        //Send the token to authenticate the socket
                        .emit('authenticate', {token: jwt}); //send the jwt
                });
            }

            /*Event to be emitted to the Server*/
            function login(){
                /*
                var data = {
                    event : 'login',
                    contactsToNotify : Sync.getActiveUser().contacts,
                    username : Sync.getActiveUser().username
                };
                socket.emit(data.event, data);
                */
            }

            function logout() {
                var data = {
                    event : 'logout',
                    contactsToNotify : Sync.getActiveUser().contacts,
                    username : Sync.getActiveUser().username
                };
                socket.emit(data.event, data);
            }

            function disconnect(){
                socket.emit('disconnect',{});
            }

            function sendMessage(chatName, to, message){
                var data = {
                    event : 'messageSent',
                    message : message,
                    from : Sync.getActiveUser().username,
                    to : to,
                    chat : chatName || (Sync.getActiveUser().username + ' - ' + to)
                };

                console.log(data);

                Messaging.addMessage(data);

                data.to = Sync.getContactId(to);
                socket.emit(data.event, data);
            }

            return {
                initialize: initialize,
                logout: logout,
                login:login,
                disconnect:disconnect,
                sendMessage : sendMessage
            }
        }]);