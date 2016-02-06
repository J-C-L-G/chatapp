angular.module('chatApp')
    .controller('activeConversation.Controller',
    ['$scope', '$stateParams', 'Socket', 'Sync', 'Messaging',
        function ($scope, $stateParams, Socket, Sync, Messaging) {
            $scope.message = '';
            $scope.username = Sync.getActiveUser().username;

            $scope.messages = (function () {
                var chat = Messaging.getChatByName($stateParams.to);
                if (!angular.isUndefined(chat)) {
                    return chat.messages;
                }
                else {
                    var chatName = {chat : $stateParams.to};
                    Messaging.addMessage(chatName);
                    return Messaging.getChatByName($stateParams.to).messages;
                }
            })();

            $scope.sendMessage = function () {
                var data = {
                    message : $scope.message,
                    to : $stateParams.to
                };
                Socket.sendMessage(data);
                $scope.message = '';
            }
        }]);