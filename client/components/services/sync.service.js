angular.module('chatApp')
    .factory('Sync', [function () {

        /*Utility Function to work inside the service, not exposed to the Application*/

        //Check if an object is contained in a list
        // property optional, default to _id
        function isContained(contact_value, contactList, property){
            for( var index in contactList){
                if(contactList[index][property || '_id'] == contact_value){
                    return true;
                }
            }
            return false;
        }

        //activeUser in the application
        var activeUser = {};

        /**
         * Method to set the activeUser in the application
         * @param user
         */
        function setActiveUser(user) {
            activeUser = user;
        }

        /**
         * Gets all available info on authenticated user
         * @returns {object}
         */
        function getActiveUser() {
            return activeUser;
        }

        /**
         * Check if the user is logged in
         *
         * @return {Boolean}
         */
        function isLoggedIn() {
            return (activeUser.hasOwnProperty('username'));
        }

        /**
         * Function to be executed when a contact request has been accepted
         * The contact id will be inserted in the contact array and
         * removed from the pendingContacts array.
         *
         * @param contact_id  {String}
         *
         * @return {Boolean}
         */
        function updateContacts(contact_id) {

            for (var index in activeUser.pendingContacts) {
                if (activeUser.pendingContacts[index]._id == contact_id) {
                    if (activeUser.pendingContacts.length == 1) {
                        if(isContained(contact_id, activeUser.contacts)){
                            activeUser.pendingContacts.pop()
                        }else{
                            activeUser.contacts.push(activeUser.pendingContacts.pop());
                        }
                    } else if (activeUser.pendingContacts.length > 1) {
                        if(isContained(contact_id, activeUser.contacts)){
                            activeUser.pendingContacts.splice(index, 1);
                        }else{
                            activeUser.contacts.push(activeUser.pendingContacts[index]);
                            activeUser.pendingContacts.splice(index, 1);
                        }
                    }
                    return true;
                }
            }
            return false;
        }

        /**
         * Before sent an Ajax to request contact acceptance
         * we will verify that the user doesn't not have this
         * contact already as a contact, pending acceptance
         * we already sent a friend request to this user.
         *
         * @param contact_id  {String}
         * @return {Array}
         */
        function sentContactRequest(contact_id){

            if(isContained(contact_id,activeUser.pendingContacts))
                return [false, 'pendingContacts'];
            if(isContained(contact_id, activeUser.contacts))
                return [false, 'contacts'];
            if(isContained(contact_id, activeUser.notifications, 'from'))
                return [false, 'notifications'];
            //If is not contained
            return [true];
        }

        /*** API Exposed to the application ***/
        return {
            setActiveUser : setActiveUser,
            getActiveUser : getActiveUser,
            isLoggedIn : isLoggedIn,
            updateContacts : updateContacts,
            sentContactRequest:sentContactRequest
        }
    }]);