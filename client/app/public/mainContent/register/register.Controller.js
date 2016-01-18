angular.module('chatApp')
    .controller('register.Controller', ['$scope', 'Auth', '$state', function ($scope, Auth, $state) {
        $scope.user = {
            username: '',
            password: '',
            email: ''
        };

        $scope.register = function (user) {
            var registerPromise = Auth.createUser(user);
            //Promise returned by the register function
            registerPromise.then(
                function (data) {
                    console.log(data);
                    $state.go('main');
                }, function (error) {
                    console.log(error);
                });
        };
    }]);