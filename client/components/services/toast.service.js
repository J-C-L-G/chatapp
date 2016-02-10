angular.module('chatApp').
    factory('Toast',['$mdToast','Sync',function($mdToast){

        var tempNotifications = [];
        var counter = 1;

        function getTemporaryNotifications(){
            return tempNotifications;
        }

        function showSimpleToast(message) {
            if(message) {
                tempNotifications.push({message: message, _id: counter++});

                $mdToast.show(
                    $mdToast.simple()
                        .textContent(message)
                        .position('top right')
                        .hideDelay(3000)
                );
            }

            /***********************************************************************
             *  NOTE: This code needs to be replaced by building a directive for the
             *  activeConversation Template, because here we are using the
             *  $scope.destroy() from the mdToast's link function to force the
             *  scope to be updated hence the ng-repeats will be executed again.
             *
             *  Heavy task and no good performance will be achieved with this approach.
             *
             *  REQUIRED TO BE CHANGED!
             ***********************************************************************/
            else{
                $mdToast.show();
            }
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