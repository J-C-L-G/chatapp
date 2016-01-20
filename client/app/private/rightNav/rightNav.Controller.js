angular.module('chatApp')
.controller('rightNav.Controller',['$rootScope','$scope','UserInterface',function($rootScope,$scope,UserInterface){

        $scope.toggleContactInfo = UserInterface.buildToggler('contactInfo');
        $scope.toggleNotifications = UserInterface.buildToggler('notifications');

        $scope.$on("TOGGLE_CONTACTINFO",function(){
            $scope.toggleContactInfo();
        });

        $scope.$on("TOGGLE_NOTIFICATIONS",function(){
            $scope.toggleNotifications();
        });

    }]);