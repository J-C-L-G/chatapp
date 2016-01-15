angular.module('chatApp')
.controller('login.Controller',['$scope', '$http','$cookieStore','Auth',function($scope, $http, $cookieStore, Auth){
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