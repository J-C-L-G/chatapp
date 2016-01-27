angular.module('chatApp')
    .controller('leftNav.Controller', ['$rootScope','$scope','UserInterface','$http','User','Auth','Toast','Socket',
        function($rootScope,$scope,UserInterface,$http,User,Auth,Toast,Socket){

            /**********************************************************************
             * Handler to Manipulate the Contacts Navigation Menu                 *
             **********************************************************************/
            $scope.toggleContacts = UserInterface.buildToggler('contacts');

            //Listen for Events requesting to open the Contact Menu
            $scope.$on("TOGGLE_CONTACTS",function(){
                $scope.toggleContacts();
            });


            /**********************************************************************
             * Broadcast a request to enable the ContactsInfo Navigation Menu     *
             **********************************************************************/
            $scope.toggleContactInfo = function(){
                $rootScope.$broadcast("TOGGLE_CONTACTINFO");
            };


            /****************************************************************
             * View Handlers for Panels in the Contacts Navigation Menu     *
             ****************************************************************/
            $scope.panels = {
                'contactSearch':false,
                'showContacts':false,
                'pendingContacts':false
            };
            //Search For Contacts
            $scope.toggleContactSearch = UserInterface.buildPanelToggler($scope.panels,'contactSearch');

            //Show Contacts
            $scope.toggleShowContacts = UserInterface.buildPanelToggler($scope.panels,'showContacts');

            //Show Pending Contacts Request
            $scope.togglePendingContacts = UserInterface.buildPanelToggler($scope.panels,'pendingContacts');


            /****************************************************************
             * Handlers for the User Actions in the View                    *
             ****************************************************************/

            // User Object pulled from from the service
            $scope.user = Auth.getActiveUser();

            // Search Panel handlers
            $scope.searchName = '';
            $scope.searchResults = [];

            //Function to be executed when the user send a Search Request
            $scope.searchForContacts = function(name){
                User.findContacts({names:name})
                    .$promise
                    .then(function(data){
                        $scope.searchResults = data.contactsFound;
                    },function(error){
                        console.log(error);
                    }
                );
            };

            //Function to be executed when the user adds a contact
            $scope.addContact = function(contact){
                //Verify if the user is already a pending contact
                for(var index in $scope.user.pendingContacts){
                    if($scope.user.pendingContacts[index]._id == contact._id){
                        Toast.notify(contact.username + ' is already in your contacts please wait for confirmation.');
                        return false;
                    }
                }
                //If an invitation has not been sent, proceed with the request.
                User.addContact({'contact_id':contact._id})
                    .$promise
                    .then(function(data){
                        $scope.user.pendingContacts = data.pendingContacts;
                        Toast.notify('Contact request sent to ' +contact.username);
                    },function(error){
                        console.log(error);
                    }
                );
            };
        }
    ]);