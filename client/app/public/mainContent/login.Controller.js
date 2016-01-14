angular.module('chatApp')
.controller('login.Controller',['$scope', '$http','$cookieStore',function($scope, $http, $cookieStore){
        $scope.user = {
            username:'',
            password:''
        };
        $scope.login = function(){
            $http.post('/auth/local/login',{
                username: $scope.user.username,
                password: $scope.user.password
            }).success(function(data){
                $cookieStore.put('token', data.token);
                console.log(data);
            }).error(function(error){
                console.log(error);
            });
        };
    }]);