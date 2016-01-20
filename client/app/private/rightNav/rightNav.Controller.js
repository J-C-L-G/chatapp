angular.module('chatApp')
.controller('rightNav.Controller',['$rootScope','$scope','UserInterface','Toast',function($rootScope,$scope,UserInterface,Toast){

        $scope.toggleContactInfo = UserInterface.buildToggler('contactInfo');
        $scope.toggleNotifications = UserInterface.buildToggler('notifications');

        $scope.$on("TOGGLE_CONTACTINFO",function(){
            $scope.toggleContactInfo();
        });

        $scope.$on("TOGGLE_NOTIFICATIONS",function(){
            $scope.toggleNotifications();
        });

        $scope.testNotification = function(){
            Toast.notify('Jesus trae el poop');
        }

    }]);