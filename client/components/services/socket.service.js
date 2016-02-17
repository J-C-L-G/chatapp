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
                                login();
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
                        .on('info',function(data){
                            Toast.notify(data.message);
                        })
                        //Handler to manage when you add a contact
                        .on('contactRequest', function (data) {
                            if(Sync.addNotification(data.notification)){
                                Toast.notify(data.message);
                            }
                        })
                        //Handler to manage when your contact request has been accepted/declined
                        .on('contactResponse', function (data) {
                            if (Sync.updateContacts(data.from)) {
                                Toast.notify(data.message);
                            }
                        })
                        //Handler to manage when your contact request has been accepted/declined
                        .on('contactRemove', function (data) {
                            if (Sync.removeContactByUsername(data.contact_username)) {
                                Toast.notify(data.message);
                            }
                        })
                        .on('contactReject',function(data){
                            if(Sync.removeNotification(data.notification)){
                                Toast.notify(data.message);
                            }
                        })
                        //Handler to manage when the user sends a message
                        .on('messageSent', function(){
                        })
                        //Handler to manage when the user receives a message
                        .on('messageReceived', function(message) {
                            if(Messaging.addMessage(message)){
                                Toast.notify();
                            }
                        })
                        //Handler to manage when the user receives a message
                        .on('groupAdd', function(data) {
                            if(Sync.addGroup(data)){
                                Toast.notify(data.message);
                            }
                        })
                        .on('groupRemove', function(data){
                            if(Sync.removeGroup(data)){
                                Toast.notify(data.message);
                            }
                        })
                        .on('updateUI',function(data){
                            if(Sync.updateUI(data)){
                                Toast.notify(data.message);
                            }
                        })
                        //Send the token to authenticate the socket
                        .emit('authenticate', {token: jwt}); //send the jwt
                });
            }

            function login() {
                var data = {event : 'login'};
                socket.emit(data.event);
            }

            function logout() {
                var data = {event : 'logout'};
                socket.emit(data.event, data);
            }

            function sendMessage(data){
                data.event ='messageSent';
                socket.emit(data.event, data);
            }

            return {
                initialize: initialize,
                logout: logout,
                sendMessage : sendMessage
            }
        }]);