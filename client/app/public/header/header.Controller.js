angular.module('chatApp')
    .controller('header.Controller', ['$scope',function($scope) {
        $scope.isOpen = false;
        $scope.demo = {
            isOpen: false,
            count: 0,
            selectedDirection: 'right',
            showTooltip:true,
            tipDirection : ''
        };
    }]);