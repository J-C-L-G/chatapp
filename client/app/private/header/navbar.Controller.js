angular.module('chatApp')
    .controller('navbar.Controller', ['Auth','$rootScope','$scope','Sync','$state','Toast','Socket',
        function(Auth,$rootScope, $scope, Sync, $state,Toast,Socket){
            //Pull the active user fro the Auth Service
            $scope.user = Sync.getActiveUser();
            if($scope.user){
                Toast.notify('Welcome ' + $scope.user.username);
            }

            //Logout function to clear the object in the Auth Service
            $scope.logout = function(){
                    Toast.notify('Goodbye ' + $scope.user.username);
                    Auth.logout();
                    Socket.logout();
                    $state.go('landing');
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