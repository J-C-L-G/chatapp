/***
 * Populate DB with sample data to avoid populate the DB manually
 * with every test:
 *  - development : true
 *  - production : false
 ***/

'use strict';

var Notification = require('../../api/user/notification.model');
Notification.find({}).remove(function(){
});

var User = require('../../api/user/user.model');

User.find({}).remove(function() {
    User.create({
            provider: 'local',
            username: 'user',
            email: 'user@user.com',
            password: 'user1',
        }, {
            provider: 'local',
            role: 'user',
            username: 'carlos',
            email: 'carlos@carlos.com',
            password: 'carlos1'
        }, {
            provider: 'local',
            role: 'admin',
            username: 'admin',
            email: 'admin@admin.com',
            password: 'admin1'
        }, {
            provider: 'local',
            role: 'user',
            username: 'juan',
            email: 'juan@juan.com',
            password: 'juan1'
        },function() {
            console.log('\n************ ...::::::: MONGODB DEV INFORMATION :::::::::::... ************');
            console.log('Finished Populating Users ');
            console.log('************ ...:::::::::::::::::::::::::::::::::::::::::::... ************');
        }
    );
});