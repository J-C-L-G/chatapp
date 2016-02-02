angular.module('chatApp')
    .controller('activeConversation.Controller',
    ['$scope','$stateParams','Socket','Sync', 'Messaging',
        function($scope, $stateParams, Socket, Sync, Messaging){

            $scope.to = $stateParams.to;
            $scope.allMessages = (function(){
                if(Messaging.getMessages()[$scope.to] != undefined)
                    return Messaging.getMessages()[$scope.to].what;
                else
                    return []
            })();
            $scope.message = '';

            $scope.testMessage = function(){
                $scope.allMessages.push($scope.message);
                Socket.sendMessage(Sync.getContactId($scope.to),$scope.message);
            }

        }]);
