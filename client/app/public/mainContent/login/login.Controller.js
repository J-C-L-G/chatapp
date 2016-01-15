angular.module('chatApp')
.controller('login.Controller',['$scope','Auth',function($scope, Auth){
        $scope.user = {
            username:'',
            password:''
        };
        $scope.login = function(user){
            Auth.login(user).then(
                function(data){
                    console.log(data);
                },function(error){
                    console.log(error);
                });
        }
    }]);