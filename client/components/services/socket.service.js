angular.module('chatApp')
       .factory('Socket',['Toast','$rootScope',function(Toast, $rootScope){

        var socket;

        function initialize(jwt){
           socket = io.connect();

           socket.on('connect', function (data) {
                socket
                    .on('authenticated', function (data) {
                        console.log(data);
                        console.log(socket);
                    })
                    .on('receivedFriendRequest',function(message){
                        Toast.notify(message);
                        $rootScope.$broadcast('TOGGLE_NOTIFICATIONS',{message:message, saved:true});
                    })
                   .emit('authenticate', {token: jwt}); //send the jwt
            });

        }
            return {
                initialize : initialize,
                sendFriendRequest : function(data){
                    socket.emit('onFriendRequest',data);
                }
            }
        }]);