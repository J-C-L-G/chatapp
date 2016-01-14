angular.module('chatApp')
.controller('login.Controller',['$scope', '$http',function($scope, $http){
        $scope.user = {
            username:'',
            password:''
        };
        $scope.login = function(){
            $http.post('/auth/local/login',{
                username: $scope.user.username,
                password: $scope.user.password
            }).success(function(data){
                console.log(data);
            }).error(function(error){
                console.log(error);
            });
        };
    }]);