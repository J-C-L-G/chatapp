angular.module('chatApp')
    .controller('leftNav.Controller',['$scope','UserInterface',function($scope,UserInterface){
        $scope.toggleContactInfo = UserInterface.buildToggler('contactInfo');
    }]);