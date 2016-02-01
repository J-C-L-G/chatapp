angular.module('chatApp').
    factory('Toast',['$mdToast','Sync',function($mdToast){

        var tempNotifications = [];
        var counter = 1;

        function getTemporaryNotifications(){
            return tempNotifications;
        }

        function showSimpleToast(message) {
            tempNotifications.push({message:message, _id:counter++});

             $mdToast.show(
                $mdToast.simple()
                    .textContent(message)
                    .position('top right')
                    .hideDelay(3000)
            );
        }

        function logout(){
            tempNotifications = [];
            counter = 1;
        }

        return {
            notify:showSimpleToast,
            getTemporaryNotifications : getTemporaryNotifications,
            logout : logout
        }

    }]);