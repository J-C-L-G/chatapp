angular.module('chatApp')
    .controller('register.Controller', ['$scope', 'Auth', '$state','Socket', function ($scope, Auth, $state, Socket) {
        //User object to be populated with the data provided by the user.
        $scope.user = {
            username: '',
            password: '',
            ensurePassword:'',
            email: ''
        };

        //Error property to be populated after a unsuccessful registration with a error message
        $scope.error = '';

        //Register function to be executed from the form "registerForm" after the submission
        $scope.register = function (user) {
            //Promise returned from the createUser method in the Auth service
            Auth.createUser(user)
                .then(
                    function (data) {
                        if(!angular.isUndefined(data.activeUser)){
                            Socket.initialize(data.token);
                            $state.go('main');
                        }
                    },function (error) {
                    console.log(error);
                        if(error.data.errors){
                            $scope.error = error.data.errors;
                            //$state.go('landing.register');
                        }
                    }
                );
        };
    }]);