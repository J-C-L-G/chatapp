angular.module('chatApp')
.controller('mainContent.Controller', function ($scope, Socket, Sync, Messaging) {

        //DUMMY IMPLEMENTATION

        var imagePath = 'static/assets/60.jpeg';

        $scope.messages = Messaging.getMessages();

        $scope.testMessage = function(){
            Socket.sendMessage(Sync.getActiveUser().contacts[0]._id,'test message');
        }

});