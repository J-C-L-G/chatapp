angular.module('chatApp')
    .controller('rightNav.Controller',['$scope','UserInterface','Toast','Sync','User',
        function($scope,UserInterface,Toast,Sync,User){

            //Pull the ActiveUser from the service
            $scope.user = Sync.getActiveUser();
            $scope.tempNotifications = Toast.getTemporaryNotifications();

            /*******************************************************************************
             * Handler to Manipulate the ContactsInfo and Notifications Navigation Menu    *
             *******************************************************************************/

            $scope.toggleContactInfo = UserInterface.buildToggler('contactInfo');
            $scope.toggleNotifications = UserInterface.buildToggler('notifications');

            $scope.$on("TOGGLE_CONTACTINFO",function(){
                $scope.toggleContactInfo();
            });

            $scope.$on("TOGGLE_NOTIFICATIONS",function(event){
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