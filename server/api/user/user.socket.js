'use strict';

var User = require('./user.model');

module.exports = function(socket_io){

    User.socket = {
        notify : function(to, data){
            socket_io.to(to).emit(data.event, data);
        }
    };

};
