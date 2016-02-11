'use strict';

var User = require('../user/user.model'),
    Group = require('./group.model');


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