angular.module('chatApp')
    .controller('navbar.Controller', ['$scope','Auth','$state',function($scope, Auth, $state) {
        $scope.user = Auth.getActiveUser();

        $scope.refreshName = function(){
            $scope.user = Auth.getActiveUser();
        };
        $scope.logout =
            function(){
                Auth.logout();
                $state.go('landing');
            };
        $scope.isOpen = false;
        $scope.demo = {
            isOpen: false,
            count: 0,
            selectedDirection: 'left'
        };
    }]);