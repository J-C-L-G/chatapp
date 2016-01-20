angular.module('chatApp')
    .controller('navbar.Controller', ['$scope','Auth','$state','UserInterface',function($scope, Auth, $state, UserInterface ) {
        $scope.user = Auth.getActiveUser();

        $scope.logout =
            function(){
                Auth.logout();
                $state.go('landing');
            };

        $scope.toggleContacts = UserInterface.buildToggler('contacts');
        $scope.toggleNotiofications = UserInterface.buildToggler('notifications');

    }]);