angular.module('chatApp')
    .controller('rightNav.Controller',['$rootScope','$scope','UserInterface','Toast','Auth',
        function($rootScope,$scope,UserInterface,Toast,Auth){

            /**********************************************************************
             * Handler to Manipulate the ContactsInfo and Notifications Navigation Menu                 *
             **********************************************************************/

            $scope.toggleContactInfo = UserInterface.buildToggler('contactInfo');
            $scope.toggleNotifications = UserInterface.buildToggler('notifications');

            $scope.$on("TOGGLE_CONTACTINFO",function(){
                $scope.toggleContactInfo();
            });

            $scope.$on("TOGGLE_NOTIFICATIONS",function(event,data){
                $scope.toggleNotifications();
                console.log(data);
                if(data.saved){
                    $scope.notifications.push(data.message);
                }
            });

            $scope.notifications = Auth.getActiveUser().notifications;


            //DUMMY IMPLEMENTATION
            $scope.testNotification = function(){
                Toast.notify('Testing a notification');
            }
    }]);