angular.module('chatApp')
       .factory('Socket',['Toast','$rootScope','Sync',
        function(Toast, $rootScope, Sync){

            //Variable to hold the reference to the socket
            var socket;

            function initialize(jwt){
               //Initialize the socket variable
               socket = io.connect();

               socket.on('connect', function(){
                    /*** Events to be listening from the Sever Side ***/
                    socket
                        //Handler to authenticate the socket
                        .on('authenticated', function (data) {
                            if(data){
                                console.log(data);
                                console.log(socket);
                            }
                        })
                        //Handler to notify when the user login
                        .on('login',function(){})
                        //Handler to notify when the user logout
                        .on('logout',function(){})
                        //Handler to manage when you add a contact
                        .on('contactRequest',function(data){
                            console.log(data);
                            Toast.notify(data.message);
                            $rootScope.$broadcast('TOGGLE_NOTIFICATIONS',{event:data.event, message:data.message, from:data.from});
                        })
                        //Handler to manage when your contact request has been accepted/declined
                        .on('contactResponse',function(data){
                            console.log(data);
                            if(Sync.updateContacts(data.from)){
                                Toast.notify(data.message);
                            }
                        })
                        //Handler to manage when the user sends a message
                        .on('messageSent',function(){})
                        //Handler to manage when the user receives a message
                        .on('messageReceived',function(){})

                        //Send the token to authenticate the socket
                       .emit('authenticate', {token: jwt}); //send the jwt
                });
            }
                return {
                    initialize : initialize,
                    logout : function(){
                        socket.emit('disconnect');
                    }
                }
        }]);