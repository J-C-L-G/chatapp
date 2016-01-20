angular.module('chatApp')
    .controller('navbar.Controller', ['$rootScope','$scope','Auth','$state','UserInterface','Toast',function($rootScope, $scope, Auth, $state, UserInterface,Toast ) {
        $scope.user = Auth.getActiveUser();
        Toast.notify('Welcome ' + $scope.user.username);

        $scope.logout =
            function(){
                Toast.notify('Goodbye ' + $scope.user.username);
                Auth.logout();
                $state.go('landing');
            };

        //$scope.toggleContacts = UserInterface.buildToggler('contacts');

        $scope.toggleContacts = function(){
            $rootScope.$broadcast("TOGGLE_CONTACTS",{})
        };

        $scope.toggleNotifications = function(){
            $rootScope.$broadcast("TOGGLE_NOTIFICATIONS",{});
        };

    }]);