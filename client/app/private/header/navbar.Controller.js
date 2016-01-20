angular.module('chatApp')
    .controller('navbar.Controller', ['$rootScope','$scope','Auth','$state','UserInterface','$mdToast',function($rootScope, $scope, Auth, $state, UserInterface,$mdToast ) {
        $scope.user = Auth.getActiveUser();

        $scope.logout =
            function(){
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