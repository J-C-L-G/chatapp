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

            $scope.$on("TOGGLE_NOTIFICATIONS",function(event,data){
                //If data.showPanel is true, the menu will be shown
                if(data.showPanel){
                    $scope.toggleNotifications();
                }
                //If the Notification is a contactRequest,
                // we push it so the user can Accept or Decline
                if(data.event == 'contactRequest'){
                    Sync.getActiveUser().notifications.push(data);
                }
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

            $scope.acceptRequest = function(notification_id, contact_id){
                //If an invitation has not been sent, proceed with the request.
                User.confirmContact({'notification_id':notification_id, 'contact_id':contact_id})
                    .$promise
                    .then(function(data){
                        if(data.contacts && data.pendingContacts ){
                            Sync.getActiveUser().contacts = data.contacts;
                            Sync.getActiveUser().pendingContacts = data.pendingContacts;
                            Sync.getActiveUser().notifications = data.notifications;
                            Toast.notify('Contact added to your list!');
                        }
                    },function(error){
                        console.log(error);
                    }
                );

            }
    }]);