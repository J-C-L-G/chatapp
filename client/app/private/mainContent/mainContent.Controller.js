angular.module('chatApp')
    .controller('mainContent.Controller', function ($scope, Socket, Sync, Messaging, UserInterface) {
        $scope.username = Sync.getActiveUser().username;
        $scope.messages = Messaging.getConversations();
        $scope.removeConversation = function(chatName, $event){

            if ($event.stopPropagation)
                $event.stopPropagation();
            if ($event.preventDefault)
                $event.preventDefault();

            var options = {
                title : 'Delete a Conversation',
                textContent : 'Are you sure you want to delete '+chatName+'\'s conversation ?',
                ariaLabel : 'Delete a Conversation',
                targetEvent : $event,
                ok : 'Yes',
                cancel : 'No'
            };

            UserInterface.buildConfirmationDialog(options)
                .then(function () {
                    Messaging.clearChatByName(chatName);
                });
        }
    });