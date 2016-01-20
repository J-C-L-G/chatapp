angular.module('chatApp').
    factory('Toast',['$mdToast',function($mdToast){

         function showSimpleToast(text) {
            $mdToast.show(
                $mdToast.simple()
                    .textContent(text)
                    .position('top right')
                    .hideDelay(3000)
            );
        }

        return {
            notify:showSimpleToast
        }

    }]);