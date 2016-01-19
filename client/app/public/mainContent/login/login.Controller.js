angular.module('chatApp')
.controller('login.Controller',['$scope','Auth','$state',function($scope, Auth, $state){
        //User object to be populated with the data provided by the user.
        $scope.user = {
            username:'',
            password:''
        };

        //Error property to be populated after a unsuccessful login with a error message
        $scope.error='';

        //Login function to be executed from the controller after the "loginForm" form submission
        //Auth service in charge of the implementation.
        $scope.login = function(user){
            Auth.login(user).then(
                function(data){
                    if(data.activeUser)
                        $state.go('main');
                },function(error){
                    if(error.message)
                        $scope.error = error.message;
                });
        }
    }]);