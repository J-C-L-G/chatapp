angular.module('chatApp')
    .controller('activeConversation.Controller',
    ['$scope', '$stateParams', 'Socket', 'Sync', 'Messaging',
        function ($scope, $stateParams, Socket, Sync, Messaging) {
            $scope.to = $stateParams.to;
            $scope.message = '';
            $scope.username = Sync.getActiveUser().username;

            $scope.messages = (function () {
                var chat = Messaging.getChatByName($scope.to);
                if (chat != undefined) {
                    return chat.messages;
                }
                else {
                    return [];
                }
            })();

            $scope.sendMessage = function () {
                var data = {
                    message : $scope.message,
                    from : Sync.getActiveUser().username,
                    to : $scope.to,
                    chat : $scope.to
                };
                Messaging.addMessage(data);
                $scope.messages = Messaging.getChatByName($scope.to).messages;
                Socket.sendMessage(data);
                $scope.message = '';
            }
        }]);