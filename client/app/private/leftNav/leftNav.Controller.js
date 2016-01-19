angular.module('chatApp')
    .controller('leftNav.Controller',['$scope','$mdSidenav','$log',function($scope,$mdSidenav,$log){
        $scope.close = function () {
            $mdSidenav('left').close()
                .then(function () {
                    $log.debug("close LEFT is done");
                });
        };

        $scope.openContactInfo = function(){
            $mdSidenav('contactInfo').open()
                .then(function () {
                    $log.debug("open contactInfo is done");
                });
        };
        
        $scope.closeContactInfo = function(){
            $mdSidenav('contactInfo').close()
                .then(function () {
                    $log.debug("close contactInfo is done");
                });
        };
    }]);