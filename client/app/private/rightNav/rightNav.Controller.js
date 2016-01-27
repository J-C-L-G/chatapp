angular.module('chatApp')
    .controller('rightNav.Controller',['$rootScope','$scope','UserInterface','Toast','Auth',
        function($rootScope,$scope,UserInterface,Toast,Auth){

            //Pull the ActiveUser from the service
            $scope.user = Auth.getActiveUser();

            /**********************************************************************
             * Handler to Manipulate the ContactsInfo and Notifications Navigation Menu                 *
             **********************************************************************/

            $scope.toggleContactInfo = UserInterface.buildToggler('contactInfo');
            $scope.toggleNotifications = UserInterface.buildToggler('notifications');

            $scope.$on("TOGGLE_CONTACTINFO",function(){
                $scope.toggleContactInfo();
            });

            $scope.$on("TOGGLE_NOTIFICATIONS",function(event,data){
                if(data.showPanel){
                    $scope.toggleNotifications();
                }
                if(data.message){
                    $scope.user.notifications.push({message: data.message, action: data.type, from_id:data.from._id});
                }
            });

            //DUMMY IMP
            $scope.acceptContact = function(id){
                console.log(id);
            }
    }]);