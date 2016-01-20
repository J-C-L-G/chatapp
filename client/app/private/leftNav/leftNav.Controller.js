angular.module('chatApp')
    .controller('leftNav.Controller',['$rootScope','$scope','UserInterface',function($rootScope,$scope,UserInterface){

        $scope.toggleContacts = UserInterface.buildToggler('contacts');

        $scope.$on("TOGGLE_CONTACTS",function(){
            $scope.toggleContacts();
        });

        $scope.toggleContactInfo = function(){
            $rootScope.$broadcast("TOGGLE_CONTACTINFO");
        };

    }]);