angular.module('chatApp')
    .controller('leftNav.Controller', ['$rootScope','$scope','UserInterface','$http','User','Sync','Toast',
        function($rootScope,$scope,UserInterface,$http,User,Sync,Toast){

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
            $scope.toggleGroups = function(){
                $rootScope.$broadcast("TOGGLE_GROUPS");
            };


            /****************************************************************
             * View Handlers for Panels in the Contacts Navigation Menu     *
             ****************************************************************/
            $scope.panels = {
                'contactSearch':false,
                'showContacts':false,
                'pendingContacts':false,
                'showGroups':false
            };
            //Search For Contacts
            $scope.toggleContactSearch = UserInterface.buildPanelToggler($scope.panels,'contactSearch');

            //Show Contacts
            $scope.toggleShowContacts = UserInterface.buildPanelToggler($scope.panels,'showContacts');

            //Show Pending Contacts Request
            $scope.togglePendingContacts = UserInterface.buildPanelToggler($scope.panels,'pendingContacts');

            //Show Contact Groups
            $scope.toggleUserGroups = UserInterface.buildPanelToggler($scope.panels,'showGroups');


            /****************************************************************
             * Handlers for the User Actions in the View                    *
             ****************************************************************/
            $scope.user = Sync.getActiveUser();

            // Properties on the scope
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
                var verify = Sync.sendContactRequest(contact.username); // [[true/false]['contactPresentIn']]

                // If an invitation has not been sent, proceed with the request.
                if(verify[0] == true){
                    User.addContact({'contact_username':contact.username})
                        .$promise
                        .then(function(data){
                            console.log(data);
                        },function(error){
                            console.log(error);
                        });
                }else{
                    if(verify[1] == 'pendingContacts')
                        Toast.notify(contact.username + ' is already in your contacts please wait for confirmation.');

                    else if(verify[1] == 'contacts')
                        Toast.notify(contact.username + ' is already in your contacts.');

                    else if(verify[1] == 'notifications')
                        Toast.notify('A contact request from ' + contact.username + ' is pending to be accepted, please check your notifications!');
                }
            };

            //Function to be executed when the user wants to remove one contact
            $scope.deleteContact = function(contact_username,$event) {
                var options = {
                    title : 'Remove a Contact',
                    textContent : 'Are you sure you want to delete '+contact_username+' from your contacts?.',
                    ariaLabel : 'Remove Contact',
                    targetEvent : $event,
                    ok : 'Yes',
                    cancel : 'No'
                };

                UserInterface.buildConfirmationDialog(options)
                    .then(function () {
                        User.deleteContact({'contact_username':contact_username})
                            .$promise
                            .then(function(data){
                                console.log(data);
                            },function(error){
                                console.log(error);
                            });
                    });
            };

            /** **/
        }
    ]);