angular.module('chatApp')
    .controller('navbar.Controller', ['Auth','$rootScope','$scope','Sync','$state','Toast','Socket','Messaging',
        function(Auth,$rootScope, $scope, Sync, $state,Toast,Socket, Messaging){
            //Pull the active user fro the Auth Service
            $scope.user = Sync.getActiveUser();
            if(!angular.isUndefined($scope.user.username)){
                Toast.notify('Welcome ' + $scope.user.username);
            }

            //Logout function to clear the object in the Auth Service
            $scope.logout = function(){
                Auth.logout()
                    .then(function(){
                        Toast.notify('Goodbye ' + $scope.user.username);
                        Toast.logout(); // Clear the temp notifications.
                        Messaging.logout(); // Clear the Messages in the Service.
                        Socket.logout(); // Destroy the Socket instance.
                        $state.go('landing'); //Go to landing page.
                    });
            };

            //Broadcast an event to open the Contacts panel
            $scope.toggleContacts = function(){
                $rootScope.$broadcast('TOGGLE_CONTACTS');
            };

            //Broadcast an event to open the Notifications panel
            $scope.toggleNotifications = function(){
                //showPanel true to toggle the menu
                $rootScope.$broadcast('TOGGLE_NOTIFICATIONS',{showPanel:true});
            };
    }]);