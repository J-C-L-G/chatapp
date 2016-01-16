angular.module('chatApp')
.controller('register.Controller',['$scope','Auth','$state',function($scope, Auth, $state){
        $scope.user = {
            username:'',
            password:'',
            email:''
        };

        $scope.register = function(user){
            var result = Auth.createUser(user);
            console.log(result);
            if(result){
                $state.go('main');
            }
        };
    }]);