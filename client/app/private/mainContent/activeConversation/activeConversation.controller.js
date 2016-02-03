angular.module('chatApp')
    .controller('activeConversation.Controller',
    ['$scope','$stateParams','Socket','Sync', 'Messaging',
        function($scope, $stateParams, Socket, Sync, Messaging){

            console.log('ran');
            $scope.to = $stateParams.to;
            $scope.chatName = undefined;
            $scope.allMessages = (function(){
                if(Messaging.getMessages()[$scope.to + ' - ' + Sync.getActiveUser().username] != undefined){
                    $scope.chatName = $scope.to + ' - ' + Sync.getActiveUser().username;
                    return Messaging.getMessages()[$scope.to + ' - ' + Sync.getActiveUser().username].what;
                }
                else if(Messaging.getMessages()[Sync.getActiveUser().username + ' - ' + $scope.to] != undefined){
                    $scope.chatName = Sync.getActiveUser().username + ' - ' + $scope.to;
                    return Messaging.getMessages()[Sync.getActiveUser().username + ' - ' + $scope.to].what;
                }
                else{
                    return [];
                }
            })();
            $scope.message = '';

            $scope.testMessage = function(){
                //$scope.allMessages.push({message: $scope.message, from: Sync.getActiveUser().username});
                Socket.sendMessage($scope.chatName, $scope.to, $scope.message);
            }
        }]);