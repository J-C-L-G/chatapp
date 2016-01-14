/***
 * Populate DB with sample data to avoid populate the DB manually
 * with every test:
 *  - development : true
 *  - production : false
 ***/

'use strict';

var User = require('../../api/user/user.model');

User.find({}).remove(function() {
    User.create({
            provider: 'local',
            username: 'Test User',
            email: 'test@test.com',
            password: 'test',
        }, {
            provider: 'local',
            role: 'admin',
            username: 'Admin',
            email: 'admin@admin.com',
            password: 'admin'
        }, function() {
            console.log('\n************ ...::::::: MONGODB DEV INFORMATION :::::::::::... ************');
            console.log('Finished Populating Users ');
            console.log('************ ...:::::::::::::::::::::::::::::::::::::::::::... ************');
        }
    );
});