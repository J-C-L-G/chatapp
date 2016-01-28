angular.module('chatApp')
    .controller('rightNav.Controller',['$scope','UserInterface','Toast','Auth','User',
        function($scope,UserInterface,Toast,Auth,User){

            //Pull the ActiveUser from the service
            $scope.user = Auth.getActiveUser();

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
                    $scope.user.notifications.push(data);
                }
            });

            /****************************************************************
             * Handlers for the User Actions in the View                    *
             ****************************************************************/

            $scope.acceptRequest = function(id){
                //If an invitation has not been sent, proceed with the request.
                User.confirmContact({'contact_id':id})
                    .$promise
                    .then(function(data){
                        if(data.contacts && data.pendingContacts ){
                            $scope.user.contacts = data.contacts;
                            $scope.user.pendingContacts = data.pendingContacts;
                            Toast.notify('Contact added to your list!');
                        }
                    },function(error){
                        console.log(error);
                    }
                );

            }
    }]);