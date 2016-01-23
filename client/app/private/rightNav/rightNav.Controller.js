angular.module('chatApp')
    .controller('rightNav.Controller',['$rootScope','$scope','UserInterface','Toast',
        function($rootScope,$scope,UserInterface,Toast){

            /**********************************************************************
             * Handler to Manipulate the ContactsInfo and Notifications Navigation Menu                 *
             **********************************************************************/

            $scope.toggleContactInfo = UserInterface.buildToggler('contactInfo');
            $scope.toggleNotifications = UserInterface.buildToggler('notifications');

            $scope.$on("TOGGLE_CONTACTINFO",function(){
                $scope.toggleContactInfo();
            });

            $scope.$on("TOGGLE_NOTIFICATIONS",function(){
                $scope.toggleNotifications();
            });


            //DUMMY IMPLEMENTATION
            $scope.testNotification = function(){
                Toast.notify('Testing a notification');
            }
    }]);