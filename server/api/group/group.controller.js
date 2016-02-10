'use strict';

var User = require('../user/user.model'),
    Group = require('./group.model');

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
                    'name' : newGroup.name,
                    'members' : members,
                    'admin' : user._id
                };

                new Group(group).save(function (error, groupSaved) {
                    if(error) throw error;

                    if(groupSaved){

                        groupSaved.members.forEach(function(groupmember){

                            /**********************************
                             *  Socket Call 'updateUI'  *
                             **********************************/
                            User.socket.notify(groupmember,
                                {
                                    'event': 'groupAdd',
                                    'group': {
                                        'name' : groupSaved.name,
                                        'members' : groupSaved.members
                                    },
                                    'message': 'You were added to a new Group by ' + user.username
                                }
                            );
                        });

                        /*** Reply with JSON to the requester ***/
                        res.json({'success': true});
                    }
                });


            }
        }
    );

    /*

     */

};