angular.module('chatApp')
    .controller('rightNav.Controller',['$scope','UserInterface','Toast','Sync','User',
        function($scope,UserInterface,Toast,Sync,User){

            $scope.tempNotifications = Toast.getTemporaryNotifications();

            /*******************************************************************************
             * Handler to Manipulate the ContactsInfo and Notifications Navigation Menu    *
             *******************************************************************************/

            $scope.toggleGroups = UserInterface.buildToggler('groups');

            $scope.$on("TOGGLE_GROUPS",function(){
                $scope.toggleGroups();
            });

            $scope.toggleNotifications = UserInterface.buildToggler('notifications');

            $scope.$on("TOGGLE_NOTIFICATIONS",function(){
                    $scope.toggleNotifications();
            });

            /****************************************************************
             * View Handlers for Panels in the Contacts Navigation Menu     *
             ****************************************************************/
            $scope.panels = {
                'contactRequest':false,
                'tempNotifications':false
            };
            //Notifications
            $scope.toggleContactRequest = UserInterface.buildPanelToggler($scope.panels,'contactRequest');

            //Temporal Notifications
            $scope.toggleTempNotifications = UserInterface.buildPanelToggler($scope.panels,'tempNotifications');


            /****************************************************************
             * Handlers for the User Actions in the View                    *
             ****************************************************************/

            $scope.acceptRequest = function(notification_id){
                //If an invitation has not been sent, proceed with the request.
                User.confirmContact({'notification_id':notification_id})
                    .$promise
                    .then(function(data){
                        console.log(data);
                    },function(error){
                        console.log(error);
                    }
                );

            }
    }]);