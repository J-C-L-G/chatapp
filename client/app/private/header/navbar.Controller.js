angular.module('chatApp')
    .controller('navbar.Controller', ['$rootScope','$scope','Auth','$state','UserInterface','Toast',
        function($rootScope, $scope, Auth, $state, UserInterface,Toast ) {
            //Pull the active user fro the Auth Service
            $scope.user = Auth.getActiveUser();
            if($scope.user){
                Toast.notify('Welcome ' + $scope.user.username);
            }

            //Logout function to clear the object in the Auth Service
            $scope.logout = function(){
                    Toast.notify('Goodbye ' + $scope.user.username);
                    Auth.logout();
                    $state.go('landing');
            };

            //Broadcast an event to open the Contacts panel
            $scope.toggleContacts = function(){
                $rootScope.$broadcast("TOGGLE_CONTACTS")
            };

            //Broadcast an event to open the Notifications panel
            $scope.toggleNotifications = function(){
                $rootScope.$broadcast("TOGGLE_NOTIFICATIONS",{showPanel:true});
            };
    }]);