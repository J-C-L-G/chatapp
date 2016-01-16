angular.module('chatApp')
.controller('login.Controller',['$scope','Auth','$state',function($scope, Auth, $state){
        $scope.user = {
            username:'',
            password:''
        };
        $scope.login = function(user){
            Auth.login(user).then(
                function(data){
                    console.log(data);
                    $state.go('main');
                },function(error){
                    console.log(error);
                });
        }
    }]);