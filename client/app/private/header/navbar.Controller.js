angular.module('chatApp')
    .controller('navbar.Controller', ['$scope','Auth','$state','$mdSidenav','$log',function($scope, Auth, $state, $mdSidenav,$log ) {
        $scope.user = Auth.getActiveUser();

        $scope.logout =
            function(){
                Auth.logout();
                $state.go('landing');
            };

        $scope.toggleLeft = buildToggler('left');
        $scope.toggleRight = buildToggler('notifications');

        /**
         * Build handler to open/close a SideNav; when animation finishes
         * report completion in console
         */
        function buildToggler(navID) {
            return function() {
                $mdSidenav(navID)
                    .toggle()
                    .then(function () {
                        $log.debug("toggle " + navID + " is done");
                    });
            }
        }

    }]);