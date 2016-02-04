angular.module('chatApp')
    .controller('mainContent.Controller', function ($scope, Socket, Sync, Messaging) {
        $scope.username = Sync.getActiveUser().username;
        $scope.messages = Messaging.getConversations();
        $scope.removeConversation = function(chatName, $event){
            Messaging.clearChatByName(chatName);
            if ($event.stopPropagation)
                    $event.stopPropagation();
            if ($event.preventDefault)
                    $event.preventDefault();
        }
    });