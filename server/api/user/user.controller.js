'use strict';

var User = require('./user.model'),
    Notification = require('../notification/notification.model'),
    Group = require('../group/group.model'),
    mongoose = require('mongoose'),
    _ = require('lodash'),
    passport = require('passport'),
    config = require('../../config/environment'),
    jwt = require('jsonwebtoken');


/**************************************
 * Utility Function(s)                   *
 **************************************/

var validationError = function (res, error) {
    var errorList = [];
    for (var prop in error.errors) {
        errorList.push(error.errors[prop].message)
    }
    return res.status(422).json({'errors': errorList});
};

/**
 * ..:: Creates a new user ::..
 * This function return only the username provided
 * so it can be used as part of the login process.
 *
 * @return {jwt, object.username}
 */
exports.create = function (req, res) {
    // Create a new user from the request body.
    var newUser = new User(req.body);
    // Save the new User Object
    newUser.save(function (error, user) {
        if (error) {
            return validationError(res, error);
        }
        if (user) {
            res.json({'newUser': {'username': user.username}});
        }
    });
};


/**
 * ..:: Search for a Contact(s) ::..
 * This function return an array of contacts
 * objects matching the search criteria.
 *
 * @return { Array [ {username, email} ] }
 */
exports.find = function (req, res) {
    var usernameToFind = new RegExp('^' + req.query.names, 'i'),            // RegularExpression to be used for Search
        user = req.user;                                                    // Active user in the application

    User.find({'username': {$regex: usernameToFind, $ne: user.username}},   // ..:: Query to be Executed ::..
        {
            _id: false,                                                     // ..:: Restriction on the returned properties ::..
            role: false,
            motto: false,
            provider: false,
            pendingContacts: false,
            notifications: false,
            contacts: false,
            groups:false,
            salt: false,
            email:false,
            hashedPassword: false,
            __v: false
        },
        function (error, contactsFound) {                                   // ..:: Procedure to be Executed ::..
            if (error) throw error;
            if (contactsFound) {
                //Return documents matching the search criteria.
                res.json({'contactsFound': contactsFound});
            } else {
                //Return an empty array as no contacts were found.
                res.json({'contactsFound': []});
            }
        }
    );
};


/**
 * ..:: Add a Contact to the User's List ::..
 * Add a contact to the user's pendindContacts array
 * until confirmation is received from the
 *
 * @return {array}
 */
exports.addContact = function (req, res, next) {
    var user = req.user,                                // Active user in the application
        contact_username = req.body.contact_username;   // Contact username to be added as a pending contact

    //Search for the contact that wants to be added by username
    User.findOne({username: contact_username},  // ..:: Query to be Executed ::..
                 '_id username')                // ..:: Restriction on the returned properties ::..
        .exec(function (error, contact) {       // ..:: Procedure to be Executed ::..
            if (error) throw error;
            //If the contact_username exists in the database
            if (contact) {

                //Add a Contact to the pendingContacts array in active user document.
                User.findOneAndUpdate(
                    {_id: user._id},                                // ..:: Query to be Executed ::..
                    {$addToSet: {pendingContacts: contact._id}},    // ..:: Procedure to be Executed ::..
                    {safe: true, upsert: true},                     // ..:: R/W Options to be Applied ::..
                    function (error, userUpdated) {
                        if (error) throw error;

                        //If the contact._id was successfully added to the active user's pendingContacts Array.
                        if (userUpdated) {

                            //Find a the active user and populate his contacts
                            User.findOne({_id: user._id})           // ..:: Query to be Executed ::..
                                .populate({                         // ..:: Restriction on the returned properties ::..
                                    path: 'pendingContacts',
                                    select: '-_id username profileImage email'
                                })
                                .exec(function (error, userUpdatedWithPendingContactsUpdated) {
                                    if (error) throw error;

                                    //Create a new Notification with the contactRequest information
                                    var newNotification = {
                                        from: user._id,
                                        from_user : user.username,
                                        to: contact._id,
                                        event: 'contactRequest',
                                        message: 'Contact Request from ' + user.username
                                    };

                                    //Persist the Notification in to the Notification's Collection
                                    new Notification(newNotification).save(function (error, notification) {
                                        if (error) throw error;
                                        //If the notification was successfully persisted
                                        if (notification) {

                                            // Find the contact which the request is being sent,
                                            // and push the notification to this his notification array.
                                            User.findOneAndUpdate({_id: contact._id},               // ..:: Query to be Executed ::..
                                                {$addToSet: {notifications: notification._id}},     // ..:: Procedure to be Executed ::..
                                                {safe: true, upsert: true},                         // ..:: R/W Options to be Applied ::..
                                                function (error, notificationAdded) {
                                                    if (error) throw error;

                                                    //If the notification was successfully pushed
                                                    // into the contact's notification array.
                                                    if (notificationAdded) {

                                                        /**********************************
                                                         *  Socket Call 'contactRequest'  *
                                                         **********************************/
                                                        User.socket.notify(contact._id,
                                                            {
                                                                'event': 'contactRequest',
                                                                'notification': {
                                                                    '_id': notification._id,
                                                                    'message': notification.message,
                                                                    'from_user' : notification.from_user
                                                                },
                                                                'message': notification.message
                                                            }
                                                        );
                                                        /**********************************
                                                         *  Socket Call 'updateUI'  *
                                                         **********************************/
                                                        User.socket.notify(user._id,
                                                            {
                                                                'event': 'updateUI',
                                                                'pendingContacts': userUpdatedWithPendingContactsUpdated.pendingContacts,
                                                                'message': 'Contact Request Sent to ' + contact.username
                                                            }
                                                        );

                                                        /*** Reply with JSON to the requester ***/
                                                        res.json({'success': true});
                                                    }
                                                });
                                        }
                                    });
                                });
                        }
                    }
                );
            }
        });
};


/**
 * Confirm a contact request, the method should update the
 * pendingContacts and contacts array in the requester
 * and notify the contact that this request has been accepted.
 *
 * @return {array}
 */
exports.confirmContact = function (req, res) {
    var user = req.user,                                // Active user in the application
        notification_id = req.body.notification_id;     // Notification's id to be accepted


    //Verify that this notifications is for the user accepting the notification.
    Notification.findOne({_id: notification_id, to: user._id},    // ..:: Query to be Executed ::..
        '-event -message')                                        // ..:: Restrictions to be returned ::..
        .exec(function (error, notificationFound) {               // ..:: Procedure to be Executed ::..
            if (error) throw error;

            //If the notification was found in the collection
            if (notificationFound) {

                //Proceed to add the active user accepting this request to the contacts array
                //and at the same time, remove it from the pending contacts array.
                User.update(
                    {'_id': notificationFound.from},
                    {$pull: {pendingContacts: user._id}, $addToSet: {contacts: user._id}},
                    function (error, result) {
                        if (error) throw error;

                        //If the contact who sent the contact request document was modified successfully.
                        if (result.ok) {

                            //We proceed to add the new contact into the active users contacts.
                            //And we remove the reference to the notification that was accepted
                            User.update(
                                {_id: user._id},                                        // ..:: Query to be Executed ::..
                                {                                                       // ..:: Procedure to be Executed ::..
                                    $addToSet: {contacts: notificationFound.from},
                                    $pull: {notifications: notification_id}
                                },
                                {safe: true, upsert: true},                             // ..:: R/W Options to be Applied ::..
                                function (error, userUpdated) {
                                    if (error) throw error;

                                    //If the notification accepted was successfully removed and
                                    // the new contact has been pushed to the contacts array.
                                    if (userUpdated) {

                                        //Find our active User and populate his contacts and notifications
                                        User.findOne({_id: user._id},   // ..:: Query to be Executed ::..
                                            'contacts notifications')   // ..:: Restrictions to be returned ::..
                                            .populate({
                                                path: 'contacts',
                                                select: '-_id username profileImage email'
                                            })
                                            .populate({
                                                path: 'notifications',
                                                select: '_id message event'
                                            })
                                            .exec(function (error, userUpdatedWithContactsUpdated) {
                                                if (error) throw error;
                                                //If the user's properties was successfully populated
                                                if (userUpdatedWithContactsUpdated) {

                                                    /**********************************
                                                     *  Socket Call 'updateUI'  *
                                                     **********************************/
                                                    User.socket.notify(user._id,
                                                        {
                                                            'event': 'updateUI',
                                                            'message': 'Contact was added to your list!.',
                                                            'contacts': userUpdatedWithContactsUpdated.contacts,
                                                            'notifications': userUpdatedWithContactsUpdated.notifications
                                                        }
                                                    );

                                                    /**********************************
                                                     *  Socket Call 'contactResponse'  *
                                                     **********************************/
                                                        //Notify the Contact that was accepted to update this contacts in the F.E.
                                                    User.socket.notify(notificationFound.from,
                                                        {
                                                            event: 'contactResponse',
                                                            message: 'Contact Request Accepted from ' + user.username + '.',
                                                            from: user.username
                                                        }
                                                    );

                                                    //Remove the Notifications from the Notification Collection
                                                    Notification
                                                        .remove({_id: notificationFound._id},   // ..:: Query to be Executed ::..
                                                        function (error) {                      // ..:: Procedure to be Executed ::..
                                                            if (error) throw error;

                                                            /*** Reply with JSON to the requester ***/
                                                            res.json({'success': true});
                                                        });

                                                } else {
                                                    /*** Reply with JSON to the requester ***/
                                                    res.json({'success': false});
                                                }
                                            }
                                        );
                                    }
                                }
                            );

                        }
                    }
                );
            }
        });
};


/**
 * Remove a Contact from your contact list
 * If it was successful return the username
 * so it can be removed from the front end.
 *
 * @return {String}
 */
exports.deleteContact = function (req, res) {
    var user = req.user,                                // Active user in the application
        contact_username = req.body.contact_username;   // Contact to be removed from the list

    User.findOne({'username': contact_username},        // ..:: Query to be Executed ::..
        '_id username')                                 // ..:: Restrictions to be returned ::..
        .exec(function (error, contact) {               // ..:: Procedure to be Executed ::..
            if (error) throw error;

            //If the contact was found in the DataBase we obtain
            //the corresponding _id to proceed with the removal
            if (contact) {

                User.findOneAndUpdate(
                    {_id: user._id, contacts: {_id: contact._id}},  // ..:: Query to be Executed ::..
                    {$pull: {contacts: contact._id}},               // ..:: Procedure to be Executed ::..
                    {safe: true, upsert: true},                     // ..:: R/W Options to be Applied ::..
                    function (error, contactRemoved) {
                        if (error)  throw error;
                        //If the contact was successfully removed
                        if (contactRemoved) {

                            /**********************************
                             *  Socket Call 'updateUI'  *
                             **********************************/
                            User.socket.notify(user._id,
                                {
                                    'event': 'contactRemove',
                                    'message': contact.username + ' was removed from your contact list.',
                                    'contact_username': contact.username
                                }
                            );

                            /*** Reply with JSON to the requester ***/
                            res.json({'success': true});
                        }else{
                            /*** Reply with JSON to the requester ***/
                            res.json({'success': false});
                        }
                    });
            }
            else {
                /*** Reply with JSON to the requester ***/
                res.json({'success': false});
            }
        });
};


/**
 * Reject a Contact Request from your notifications list
 * If it was successful return the notification_id
 * so it can be removed from the front end.
 *
 * @return {String}
 */
exports.rejectContact = function (req, res) {
    var user = req.user,                                // Active user in the application
        notification_id = req.body.notification_id;     // Notification_id to be removed from the user queue

        Notification.findById(notification_id,
            function(error, notification){
                if(error) throw error;

                //If the notification was successfully found and its for the active user
                if(notification && (String(notification.to) == String(user._id)) ){

                    //We find the contact requesting and remove the active user
                    // from his pending contacts array
                    User.findById(notification.from, function(error, contact){
                        if(error) throw error;
                        //If the contact was found
                        if(contact){
                            var userIndex = _.findIndex(contact.pendingContacts, user._id);
                            if(userIndex >= 0){
                                contact.pendingContacts.splice(userIndex, 1);
                                contact.save(function(error, contactUptated){
                                    if (error)
                                        return validationError(res, error);

                                    if(contactUptated){

                                        User.socket.notify(user._id,{
                                            'event' : 'contactReject',
                                            'message' : 'Notification from ' + notification.from_user + ' has been declined',
                                            'notification' : notification._id
                                        });

                                        notification.remove(function(error){
                                            if (error)
                                                return validationError(res, error);

                                            //Respond via Json to te requester
                                            res.json({'success':true});
                                        })
                                    }
                                })
                            }
                        }
                    });
                }
                else{
                    //Respond via Json to te requester
                    res.json({'success':false});
                }
            }
        );
};

