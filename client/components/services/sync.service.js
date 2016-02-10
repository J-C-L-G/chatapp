angular.module('chatApp')
    .factory('Sync', [function () {

        /*Utility Function to work inside the service, not exposed to the Application*/

        //Check if an object is contained in a list
        // property optional, default to _id
        function isContained(contact_value, contactList, property){
            for( var index in contactList){
                if(contactList[index][property || 'username'] == contact_value){
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
        function updateContacts(contact_username) {

            for (var index in activeUser.pendingContacts) {
                if (activeUser.pendingContacts[index].username == contact_username) {
                    if (activeUser.pendingContacts.length == 1) {
                        if(isContained(contact_username, activeUser.contacts)){
                            activeUser.pendingContacts.pop()
                        }else{
                            activeUser.contacts.push(activeUser.pendingContacts.pop());
                        }
                    } else if (activeUser.pendingContacts.length > 1) {
                        if(isContained(contact_username, activeUser.contacts)){
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
         * Verify that the user doesn't not have this
         * contact already as a contact, pending acceptance
         * we already sent a friend request to this user.
         *
         * @param contact_username  {String}
         * @return {Array}
         */
        function sendContactRequest(contact_username){

            if(isContained(contact_username,activeUser.pendingContacts))
                return [false, 'pendingContacts'];
            if(isContained(contact_username, activeUser.contacts))
                return [false, 'contacts'];
            if(isContained(contact_username, activeUser.notifications, 'from_user'))
                return [false, 'notifications'];
            //If is not contained
            return [true];
        }

        /**
         * Get contact_id from the username
         */
        function getContactId(username){
            for(var index in activeUser.contacts){
                if(username == activeUser.contacts[index].username){
                    return activeUser.contacts[index]._id;
                }
            }
            return '';
        }

        function getContactUsername(id){
            for(var index in activeUser.contacts){
                if(activeUser.contacts[index]._id == id){
                    return activeUser.contacts[index].username;
                }
            }
            return 'id not found';
        }

        function removeContactByUsername(username){
            for(var index in activeUser.contacts){
                if(activeUser.contacts[index].username == username){
                    activeUser.contacts.splice(index, 1);
                    return true;
                }
            }
            return false;
        }

        /**
         * Function to be executed when update the notifications array
         * needs to be updated due request acceptance.
         * @param notification_id  {String}
         *
         * @return {Boolean}
         */
        function updateNotifications(notification_id) {

            for (var index in activeUser.notifications) {
                if (activeUser.notifications[index]._id == notification_id) {
                    if (activeUser.notifications.length == 1) {
                        if(isContained(notifications, activeUser.notifications, '_id')){
                            activeUser.notifications.pop()
                        }
                    } else if (activeUser.notifications.length > 1) {
                        if(isContained(notification_id, activeUser.notifications)){
                            activeUser.notifications.splice(index, 1);
                        }
                    }
                    return true;
                }
            }
            return false;
        }

        //Full replace in the properties
        function updateUI(data){
                if(!angular.isUndefined(data.pendingContacts)){
                    activeUser.pendingContacts = data.pendingContacts;
                }
                if(!angular.isUndefined(data.contacts)){
                    activeUser.contacts = data.contacts;
                }
                if(!angular.isUndefined(data.notifications)){
                    activeUser.notifications = data.notifications;
                }
            return true;
        }

        function addNotification(notification){
            activeUser.notifications.push(notification);
            return true;
        }

        function addGroup(data){
            if(data.group){
                activeUser.groups.push(data.group);
                return true;
            }else{
                return false;
            }
        }

        /*** API Exposed to the application ***/
        return {
            setActiveUser : setActiveUser,
            getActiveUser : getActiveUser,
            isLoggedIn : isLoggedIn,
            updateContacts : updateContacts,
            sendContactRequest:sendContactRequest,
            getContactId : getContactId,
            getContactUsername : getContactUsername,
            removeContactByUsername : removeContactByUsername,
            updateNotifications : updateNotifications,
            updateUI : updateUI,
            addNotification : addNotification,
            addGroup : addGroup
        }
    }]);