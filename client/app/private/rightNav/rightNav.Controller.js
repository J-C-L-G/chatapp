angular.module('chatApp')
    .controller('rightNav.Controller',['$rootScope','$scope','UserInterface','Toast','Auth',
        function($rootScope,$scope,UserInterface,Toast,Auth){

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

            //DUMMY IMP
            $scope.acceptContact = function(id){
                console.log(id);
            }
    }]);