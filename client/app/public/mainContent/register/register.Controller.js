angular.module('chatApp')
.controller('register.Controller',['$scope','Auth','$state',function($scope, Auth, $state){
        $scope.user = {
            username:'',
            password:'',
            email:''
        };

        $scope.register = function(user){
            var result = Auth.createUser(user);
            result.then(function(data){$state.go('main');},function(error){console.log(error)})
        };
    }]);