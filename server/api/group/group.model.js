'use strict';

/*Mongoose MongoDB ODM*/
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


var GroupSchema = new Schema({
    name : {
    type : String,
        required: true,
        lowercase: true,
        match: /[A-Za-z0-9 -\[\]]+/
    },
    admin : {type: Schema.Types.ObjectId, ref:'User'},
    members : [{
        type: Schema.Types.ObjectId, ref: 'User'
    }],
    profileImage : String
},{collection:'Group'});

/********************************************************
 * Validation Methods                                   *
 ********************************************************/

GroupSchema
    .path('name')
    .validate(function(value, respond){
        var self = this;
        this.constructor.findOne({name: value}, function(err, group) {
            if(err) throw err;
            if(group) {
                if(self.id === group.id) return respond(true);
                return respond(false);
            }
            respond(true);
        });
    }, 'The specified Group name is already in use.');


module.exports = mongoose.model('Group',GroupSchema);