angular.module('chatApp')
    .controller('activeConversation.Controller',
    ['$scope', '$stateParams', 'Socket', 'Sync', 'Messaging',
        function ($scope, $stateParams, Socket, Sync, Messaging) {
            $scope.to = $stateParams.to;
            $scope.message = '';

            $scope.messages = (function () {
                if (Messaging.getMessages()[$scope.to] != undefined) {
                    return Messaging.getMessages()[$scope.to].messages;
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
                $scope.messages = Messaging.getMessages()[data.chat].messages;
                Socket.sendMessage(data);
            }
        }]);