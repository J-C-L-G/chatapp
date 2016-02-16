'use strict';

var User = require('../user/user.model'),
    Group = require('./group.model'),
    _ = require('lodash');


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
 * Create a Group Conversation and Notify
 * the members about this new group.
 *
 * @return {JSON}
 */
exports.createGroup = function(req, res){
    var newGroup = req.body.newGroup;
    var user = req.user;

    var reformattedArray = newGroup.members.map(function(member){
        return member.username;
    });

    User.find( { username: { $in: reformattedArray } },
        {
            role: false,
            motto: false,
            provider: false,
            pendingContacts: false,
            notifications: false,
            contacts: false,
            salt: false,
            hashedPassword: false,
            __v: false
        },
        function(error, contacts){
            if(error) throw error;

            if(contacts){

                var members = [user._id];

                for(var index in contacts){
                    if(contacts[index].username != user.username ){
                        members.push(contacts[index]._id);
                    }
                }

                var group = {
                    'name' : newGroup.name + ' - [' + user.username+']',
                    'members' : members,
                    'admin' : user._id
                };

                new Group(group).save(function (error, groupSaved) {
                    if (error) {
                        return validationError(res, error);
                    }

                    if(groupSaved){

                        groupSaved.members.forEach(function(groupmember){

                            User.findOneAndUpdate(
                                {_id: groupmember},                             // ..:: Query to be Executed ::..
                                {$addToSet: {groups: groupSaved._id}},          // ..:: Procedure to be Executed ::..
                                {safe: true, upsert: true},                     // ..:: R/W Options to be Applied ::..
                                function (error, groupmemberUpdated) {
                                    if(error) throw error;

                                    if(groupmemberUpdated){
                                        /**********************************
                                         *  Socket Call 'updateUI'  *
                                         **********************************/
                                        User.socket.notify(groupmember,
                                            {
                                                'event': 'groupAdd',
                                                'group': {'name' : groupSaved.name},
                                                'message': 'You were added to a new Group called '+ groupSaved.name +' by ' + user.username
                                            }
                                        );
                                    }
                                });
                        });
                        /*** Reply with JSON to the requester ***/
                        res.json({'success': true});
                    }
                });
            }
        }
    );

};


/**
 * Delete the active user from a group conversation
 * and then delete this group from the group list.
 *
 * @return {JSON}
 */
exports.exitGroup = function(req, res){

    var user = req.user,
        group_name = req.body.group_name;

    Group.findOne(
        {name: group_name},
        '-__v -admin')
        .exec(function (error, group) {
            if (error) throw error;
            if (group) {
                //Verify if the user is a member
                var isMember = _.findIndex(group.members, user._id);
                if (isMember >= 0) {
                    group.members.splice(isMember,1);
                    group.save(function(error, groupModified){
                        if (error)
                            return validationError(res, error);
                        //If the user was successfully removed from the group,
                        if(groupModified){
                        //We remove this group from his list
                            var groupIndex = _.findIndex(user.groups, group._id);
                            if(groupIndex >= 0){
                                user.groups.splice(groupIndex,1);
                                user.save(function(error, userUpdated){
                                    if (error)
                                        return validationError(res, error);
                                    if(userUpdated){

                                        var message = {
                                            'event' : 'messageReceived',
                                            'from' : 'Information',
                                            'date' : new Date(),
                                            'chat' : group.name,
                                            'message' : user.username + ' has left the group.'
                                        };

                                        //Notify the members that this user has left
                                        group.members.forEach(function(member_id){
                                            User.socket.notify(member_id,message)
                                        });

                                        //Notify the user that the leave group was successful
                                        User.socket.notify(user._id,
                                            {
                                                'event': 'groupRemove',
                                                'group_name': group.name
                                            }
                                        );

                                        //Respond via Json to te requester
                                        res.json({'success':true});
                                    }
                                })
                            }
                        }
                    });
                }
          }
        });
};