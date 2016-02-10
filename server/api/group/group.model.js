'use strict';

/*Mongoose MongoDB ODM*/
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


var GroupSchema = new Schema({
    name : String,
    admin : {type: Schema.Types.ObjectId, ref:'User'},
    members : [{
        type: Schema.Types.ObjectId, ref: 'User'
    }],
    profileImage : String
},{collection:'Group'});

module.exports = mongoose.model('Group',GroupSchema);