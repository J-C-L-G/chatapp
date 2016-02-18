angular.module('chatApp')
    .controller('rightNav.Controller',['$scope','UserInterface','Toast','Sync','User','Group',
        function($scope,UserInterface,Toast,Sync,User, Group){

            $scope.user = Sync.getActiveUser();
            $scope.tempNotifications = Toast.getTemporaryNotifications();

            /*******************************************************************************
             * Handler to Manipulate the ContactsInfo and Notifications Navigation Menu    *
             *******************************************************************************/

            $scope.toggleCreateGroup = UserInterface.buildToggler('createGroup');

            $scope.$on("TOGGLE_CREATEGROUP",function(){
                $scope.toggleCreateGroup();
            });

            $scope.toggleGroupOptions = UserInterface.buildToggler('groupOptions');

            $scope.$on("TOGGLE_GROUPOPTIONS",function(){
                    $scope.toggleGroupOptions();
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
            };

            $scope.declineRequest = function(notification_id){
                //If you decline a contact request
                User.rejectContact({'notification_id':notification_id})
                    .$promise
                    .then(function(data){
                        console.log(data);
                    },function(error){
                        console.log(error);
                    });
            };

            /****************************************************************
             * Utility Functions for the Create Group Actions in the View   *
             ****************************************************************/

            /*************************
             * Search for contacts.  *
             *************************/
            function querySearch (query) {
                var results = query ?
                    $scope.user.contacts.filter(createFilterFor(query)) : [];
                return results;
            }
            /**********************************************
             * Create filter function for a query string  *
             **********************************************/
            function createFilterFor(query) {
                var lowercaseQuery = angular.lowercase(query);
                return function filterFn(contact) {
                    return (contact.username.indexOf(lowercaseQuery) != -1);
                };
            }

            /*******************************************************
             * Function that Validates that the members array for  *
             * the new group is not empty.                         *
             *******************************************************/
            function isGroupEmpty(){
                //At least 2 contacts, else can be 1-1 conversation
                return ($scope.newGroup.members.length < 2);
            }


            /****************************************************************
             * Handlers for the Group Actions in the View                    *
             ****************************************************************/

            $scope.newGroup = {
                name:'Group',
                members:[]
            };

            $scope.querySearch = querySearch;
            $scope.groupValidate = isGroupEmpty;
            $scope.filterSelected = true;

            $scope.createGroup = function(){
                Group.createGroup({'newGroup':$scope.newGroup})
                    .$promise
                    .then(function(data){
                        $scope.newGroup.name = 'Group';
                        $scope.newGroup.members = [];
                        $scope.error = [];
                    },function(error){
                        $scope.error = error.data.errors;
                    });
            };

            /****************************************************************
             * Utility Functions for the Group Options Action in the View   *
             ****************************************************************/


        }]);