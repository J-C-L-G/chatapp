angular.module('chatApp')
       .factory('Sync',['Auth',function(Auth){
        //Reference to the activeUser
        var activeUser = {};

        //Updater function to be sure we have the latest data in the FE.
        function updateUser(){
            activeUser = Auth.getActiveUser();
        }

            return {
                updateContacts : function(contact_id){
                    updateUser();
                    for(var index in activeUser.pendingContacts){
                        if(activeUser.pendingContacts[index]._id == contact_id){
                            if(activeUser.pendingContacts.length <= 1){
                                activeUser.contacts.push(activeUser.pendingContacts.pop());
                            }else{
                                activeUser.contacts.push(activeUser.pendingContacts[index]);
                                activeUser.pendingContacts.splice(index,1);
                            }
                            return true;
                        }
                    }
                    return false;
                }
            }
        }]);