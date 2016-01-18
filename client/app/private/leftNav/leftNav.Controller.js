angular.module('chatApp')
    .controller('leftNav.Controller',['$scope','$mdSidenav','$log',function($scope,$mdSidenav,$log){
        $scope.close = function () {
            $mdSidenav('left').close()
                .then(function () {
                    $log.debug("close LEFT is done");
                });
        };
    }]);