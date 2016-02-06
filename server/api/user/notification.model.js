'use strict';

/* Mongoose MongoDB ODM */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var NotificationSchema = new Schema({
    from : Schema.Types.ObjectId,
    from_user : String,
    to : Schema.Types.ObjectId,
    event : String,
    message : String
},{collection:'Notification'});

module.exports = mongoose.model('Notification',NotificationSchema);