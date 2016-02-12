angular.module('chatApp')
    .controller('activeConversation.Controller',
    ['$scope', '$stateParams', 'Socket', 'Sync', 'Messaging','$window',
        function ($scope, $stateParams, Socket, Sync, Messaging, $window) {
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

            /*** ***/
            $scope.numMessagesToDisplay = 10;
            $scope.messagesToDisplay = $scope.messages;

            $scope.$watch('messages.length',function(newVal, oldVal){
                if($scope.messages.length > $scope.numMessagesToDisplay){
                    $scope.messagesToDisplay = $scope.messages.slice($scope.messages.length-$scope.numMessagesToDisplay);
                }
            });
            /*** ***/

            $scope.sendMessage = function (image) {
                var data = {
                    message : $scope.message,
                    to : $stateParams.to
                };
                if(image)
                    data.isImage = true;
                Socket.sendMessage(data);
                $scope.message = '';
            };

            $scope.testCanvas = function(){
                $scope.canvas = $window.document.getElementById('myCanvas');
                var ctx = $scope.canvas.getContext("2d");
                ctx.fillStyle = "#FF0000";
                ctx.fillRect(0,0,50,50);
                $scope.message = $scope.canvas.toDataURL("image/jpeg", 0.1);
                $scope.sendMessage(true);
            }

        }]);