'use strict';

var User = require('./user.model'),
    Notification = require('./notification.model'),
    mongoose = require('mongoose'),
    passport = require('passport'),
    config = require('../../config/environment'),
    jwt = require('jsonwebtoken');


/**************************************
 * Utility Function                   *
 **************************************/

var validationError = function (res, error) {
    var errorList = [];
    for (var prop in error.errors) {
        errorList.push(error.errors[prop].message)
    }
    return res.status(422).json({'errors': errorList});
};

/**
 * Creates a new user
 *
 * @return {webToken, userObject}
 */
exports.create = function (req, res, next) {
    var newUser = new User(req.body);
    newUser.save(function (error, user) {
        if (error) {
            return validationError(res, error);
        }
        var token = jwt.sign({_id: user._id}, config.secrets.session, {expiresIn: 60 * 5});
        res.json({'token': token, 'newUser': user.profile});
    });
};

/**
 *Search for a Contact(s)
 *
 * @return {array}
 */

exports.find = function (req, res, next) {
    var usernameToFind = new RegExp('^' + req.query.names, 'i'),
        user = req.user;

    User.find({'username': {$regex: usernameToFind, $ne: user.username}}, //Query to be Executed
        {_id: true, username: true, email: true, profileImage: true}, //Restrictions To Be Returned
        function (error, documents) { //Procedure
            if (error) throw error;
            if (documents) {
                res.json({'contactsFound': documents}); //Return documents matching the criteria
            } else {
                res.json({'contactsFound': []}); //Return an Empty Array
            }
        }
    );
};

/**
 * Add a contact to the user's pendindContacts array
 * until confirmation is received
 *
 * @return {array}
 */
exports.addContact = function (req, res, next) {
    var user = req.user,                    //Active user in the application
        contact_id = req.body.contact_id;   //Contact id to be added as a pending contact

    //Add a Contact to the pendingContacts active user
    User.findOneAndUpdate(
        {_id: user._id},
        {$addToSet: {pendingContacts: contact_id}},
        {safe: true, upsert: true},
        function (error, userUpdated) {
            if (error) throw error;
            //If the contact was successfully added
            if (userUpdated) {

                //Find a user and populate his contacts
                User.findOne({_id: user._id})
                    .populate({
                        path: 'pendingContacts',
                        select: '_id username profileImage email'
                    })
                    .exec(function (error, userUpdatedWithPendingContactsUpdated) {
                        if (error) throw error;
                        res.json({'pendingContacts': userUpdatedWithPendingContactsUpdated.pendingContacts});

                        //Push the Notification to the array of the contact request
                        var notification = {
                            from: user._id,
                            event: 'contactRequest',
                            message: 'Contact Request from ' + user.username
                        };

                        //Persist the Notification
                        new Notification(notification).save(function (error, notification) {
                            if (error) throw error;

                            if (notification) {

                                //Find the contact which the request is being sent, and pushed the notification to
                                //this his notification array.
                                User.findOneAndUpdate(
                                    {_id: contact_id},
                                    {$addToSet: {notifications: notification._id}},
                                    {safe: true, upsert: true},
                                    function (error, notificationAdded) {
                                        if (error) throw error;
                                        if (notificationAdded) {
                                            /**********************************
                                             *  Socket Call 'contactRequest'  *
                                             **********************************/
                                            User.socket.notify(contact_id, notification);
                                        }
                                    });
                            }
                        });
                    });
            }
        }
    );
};

/**
 * Confirm a contact request, the method should update the
 * pendingContacts and contacts array in the requester
 * and notify the contact that this request has been accepted.
 *
 * @return {array}
 */
exports.confirmContact = function (req, res, next) {
    var user = req.user,
        notification_id = req.body.notification_id,
        contact_id = req.body.contact_id;

    // Verify the Contact Request on the requester contact to be sure
    // that this request is waiting to be accepted from the user making this request.
    User.update(
        {'_id': contact_id},
        {$pull: {pendingContacts: user._id}, $addToSet: {contacts: user._id}},
        function (error, result) {
            // If the contact document was modified successfully
            if (result.ok) {

                //Remove the Notifications from the Notification Collection
                Notification.remove({_id: notification_id, from: contact_id}, function (error) {

                    if (error) throw error;

                    //Add a Contact to the contacts active user
                    User.update(
                        {_id: user._id},
                        {$addToSet: {contacts: contact_id}, $pull: {notifications: notification_id}},
                        {safe: true, upsert: true},
                        function (error, userUpdated) {
                            if (error) throw error;
                            //If the contact was successfully added
                            if (userUpdated) {

                                //Find it and populate his contacts
                                User.findOne({_id: user._id})
                                    .populate({
                                        path: 'contacts pendingContacts',
                                        select: '_id username profileImage email'
                                    })
                                    .populate({
                                        path: 'notifications',
                                        select: '_id message from event'
                                    })
                                    .exec(function (error, userUpdatedWithContactsUpdated) {
                                        if (error) throw error;

                                        if (userUpdatedWithContactsUpdated) {
                                            res.json({
                                                'contacts': userUpdatedWithContactsUpdated.contacts || [],
                                                'pendingContacts': userUpdatedWithContactsUpdated.pendingContacts || [],
                                                'notifications': userUpdatedWithContactsUpdated.notifications || []
                                            });

                                            /**********************************
                                             *  Socket Call 'contactResponse'  *
                                             **********************************/
                                                //Notify the Contact that was accepted to update this contacts in the F.E.
                                            User.socket.notify(contact_id,
                                                {
                                                    event: 'contactResponse',
                                                    message: 'Contact Request Accepted from ' + user.username,
                                                    from: user._id
                                                }
                                            );
                                        } else {
                                            res.json({'error': 'not able to confirm this contact'});
                                        }
                                    }
                                );
                            }
                        }
                    );
                });
            }
        }
    );
};

/**
 * Remove a Contact from your contact list
 * If it was successful return the username
 * so it can be removed from the front end.
 *
 * @return {String}
 */
exports.deleteContact = function (req, res, next) {
    var user = req.user,
        contact_username = req.body.contact_username;

    User.findOne({'username': contact_username}, //Query to be Executed,
        '_id username') //Restrictions from what is being returned
        .exec(function (error, contact) {
            if (error) throw error;
            //If the contact was found
            if (contact) {

                User.findOneAndUpdate(
                    {_id: user._id, contacts: { _id : contact._id } },
                    {$pull: {contacts: contact._id}},
                    {safe: true, upsert: true},
                    function (error, contactRemoved) {
                        if (error) {
                            res.json({'error': 'username not found'});
                        }
                        if (contactRemoved) {
                            res.json({'contactRemoved': contact.username});
                        }
                    });
            }
            else {
                res.json({'error': 'username not found'});
            }
        });
};