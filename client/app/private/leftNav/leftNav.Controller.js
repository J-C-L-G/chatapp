angular.module('chatApp')
    .controller('leftNav.Controller',['$rootScope','$scope','UserInterface','$http','User','Auth',function($rootScope,$scope,UserInterface,$http,User,Auth){

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
         * View Handlers for Panels in the Contacts Navigation Menu     *
         ****************************************************************/

        $scope.contacts = Auth.getActiveUser().contacts;
        $scope.pendingContacts = Auth.getActiveUser().pendingContacts;
        $scope.notifications = Auth.getActiveUser().notifications;


        $scope.testAdd = function(contact){
            $scope.pendingContacts.push(contact);
        };

        $scope.searchFor = '';
        $scope.contactsResult = [];

        $scope.search = function(){
            User.findContacts({names:$scope.searchFor}).$promise.then(function(data){
                console.log(data);
                $scope.contactsResult = data.contacts;
            },function(error){
                console.log(error);
            });
        };
    }]);