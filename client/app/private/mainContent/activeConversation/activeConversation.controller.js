angular.module('chatApp')
    .controller('activeConversation.Controller',
    ['$scope', '$stateParams', 'Socket', 'Sync', 'Messaging','$window', 'UserInterface',
        function ($scope, $stateParams, Socket, Sync, Messaging, $window, UserInterface) {

            $scope.username = Sync.getActiveUser().username;
            $scope.chatingWith = $stateParams.to;

            /*****************************************************************
             * Handler for Draw Option Panel in the Active Conversation Menu *
             *****************************************************************/
            $scope.toggleDrawOptions = UserInterface.buildToggler('drawOptions');

            $scope.$on('TOGGLE_DRAWOPTIONS',function(){
                $scope.toggleDrawOptions();
            });


            /*****************************************************************
             * UI Message Builder                                            *
             *****************************************************************/
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

            $scope.numMessagesToDisplay = 10;
            $scope.messagesToDisplay = $scope.messages;

            $scope.$watch('messages.length',function(newVal, oldVal){
                if($scope.messages.length > $scope.numMessagesToDisplay){
                    $scope.messagesToDisplay =
                        $scope.messages.slice($scope.messages.length-$scope.numMessagesToDisplay);
                }
            });


            /*****************************************************************
             * Send Message Handlers                                         *
             *****************************************************************/
            $scope.message = '';

            $scope.$on('SEND_MESSAGE',function(event, imageData){
                $scope.sendMessage(imageData)
            });

            $scope.sendMessage = function (imageData) {
                var data = {
                    message : $scope.message,
                    to : $stateParams.to
                };
                //If the data is coming from the canvas directive
                if(imageData){
                    data.message = imageData.message;
                    data.isImage = true;
                }
                Socket.sendMessage(data);
                $scope.message = '';
            };

        }]);