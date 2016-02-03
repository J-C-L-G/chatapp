angular.module('chatApp')
    .controller('mainContent.Controller', function ($scope, Socket, Sync, Messaging) {
        $scope.username = Sync.getActiveUser().username;
        $scope.messages = Messaging.getConversations();
    });