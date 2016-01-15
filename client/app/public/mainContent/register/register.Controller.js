angular.module('chatApp')
.controller('register.Controller',['$scope','Auth',function($scope, Auth){
        $scope.user = {
            username:'',
            password:'',
            email:''
        };

        $scope.register = function(user){
            Auth.createUser(user);
        };
    }]);