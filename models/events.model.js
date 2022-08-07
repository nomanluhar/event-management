const mongoose = require('mongoose');

var eventSchema = new mongoose.Schema({
    eventname: {
        type: String,
        required : 'This field is required',
    },
    date: {
        type: String,
        required : 'This field is required'
    },
    time: {
        type: String,
        default : ''
    }

});

mongoose.model('events', eventSchema);
