angular.module('chatApp')
    .factory('Sync', [function () {
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
         * @return {Boolean}
         */
        function updateContacts(contact_id) {
            for (var index in activeUser.pendingContacts) {
                if (activeUser.pendingContacts[index]._id == contact_id) {
                    if (activeUser.pendingContacts.length == 1) {
                        activeUser.contacts.push(activeUser.pendingContacts.pop());
                    } else if (activeUser.pendingContacts.length > 1) {
                        activeUser.contacts.push(activeUser.pendingContacts[index]);
                        activeUser.pendingContacts.splice(index, 1);
                    }
                    return true;
                }
            }
            return false;
        }

        /*** API Exposed to the application ***/
        return {
            setActiveUser : setActiveUser,
            getActiveUser : getActiveUser,
            isLoggedIn : isLoggedIn,
            updateContacts : updateContacts
        }
    }]);