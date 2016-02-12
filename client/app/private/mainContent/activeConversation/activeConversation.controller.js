angular.module('chatApp')
    .controller('activeConversation.Controller',
    ['$scope', '$stateParams', 'Socket', 'Sync', 'Messaging','$window', 'UserInterface',
        function ($scope, $stateParams, Socket, Sync, Messaging, $window, UserInterface) {
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

            $scope.$on('SEND_MESSAGE',function(event, imageData){
                $scope.sendMessage(imageData)
            });

            $scope.sendMessage = function (imageData) {
                var data = {
                    message : $scope.message,
                    to : $stateParams.to
                };
                if(imageData){
                    data.message = imageData.message;
                    data.isImage = true;
                }
                Socket.sendMessage(data);
                $scope.message = '';
            };

            /****************************************************************
             * View Handlers for Panels in the Active Conversation Menu     *
             ****************************************************************/
            //Draw Options
            $scope.toggleDrawOptions = UserInterface.buildToggler('drawOptions');

            $scope.$on('TOGGLE_DRAWOPTIONS',function(){
                $scope.toggleDrawOptions();
            })

        }]);