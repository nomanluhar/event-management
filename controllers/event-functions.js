const mongoose = require('mongoose');
var moment = require('moment');
const nodemailer = require('nodemailer');
const ical = require('ical-generator');
const Events = mongoose.model('events');

var insertData = function (req, res) {
    Events.findOne({ eventname: req.body.eventname }, (err, response) => {
        if (response) {
            req.body.date = moment(req.body.date).format("YYYY/MM/DD");
            var converted_date = moment(response.date).format("YYYY/MM/DD");
            if (converted_date == req.body.date) {
                req.body['eventError'] = `Event is already saved on ${req.body.date} date`;
                res.render('event-folder/add-or-edit', {
                    viewTitle: "Add Events",
                    events: req.body
                });
            } else {
                saveEvent(req, res);
            };
        } else {
            saveEvent(req, res);
        };
    });
};

function saveEvent(req, res) {
    var newEvent = new Events();
    newEvent.eventname = req.body.eventname;
    newEvent.date = req.body.date;
    newEvent.time = req.body.time;
    newEvent.save((err, result) => {
        if (err) {
            if (err.name == 'ValidationError') {
                handleValidation(err, req.body);
                res.render('event-folder/add-or-edit', {
                    viewTitle: "Add Events",
                    events: req.body
                });
            } else {
                console.log('Error during data save : ' + err);
            };
        } else {
            res.redirect('event/list');
        };
    });
};

function handleValidation(err, body) {
    for (field in err.errors) {
        switch (err.errors[field].path) {
            case 'eventname':
                body['eventError'] = err.errors[field].message;
                break;
            case 'date':
                body['dateError'] = err.errors[field].message;
                break;
            default:
                break;
        };
    };
};

function updateData(req, res) {
    Events.findOne({ eventname: req.body.eventname }, (err, response) => {
        if (response && (response._id != req.body._id)) {
            req.body.date = moment(req.body.date).format("YYYY/MM/DD");
            var converted_date = moment(response.date).format("YYYY/MM/DD");
            if (converted_date == req.body.date) {
                req.body['eventError'] = `Event is already saved on ${req.body.date} date`;
                res.render('event-folder/add-or-edit', {
                    viewTitle: "Add Events",
                    events: req.body
                });
            } else {
                Events.findOneAndUpdate({ _id: req.body._id }, req.body, { new: true }, (err, response) => {
                    if (err) {
                        console.log(`Error in updating event date : ` + err);
                    } else {
                        res.redirect('event/list');
                    };
                });
            };
        } else {
            Events.findOneAndUpdate({ _id: req.body._id }, req.body, { new: true }, (err, response) => {
                if (err) {
                    console.log(`Error in updating event date : ` + err);
                } else {
                    res.redirect('event/list');
                };
            });
        };
    });

};

async function sendInvite(req, res) {
    Events.findById(req.body._id, (err, response) => {
        if (err) {
            console.log(`Error in getting event date : ` + err);
        } else {

            var smtpTransport = nodemailer.createTransport({
                service: "Gmail",
                auth: {
                    user: "trinisoft020@gmail.com",
                    pass: "faspdujfphvkworw"
                }
            });
            var calander = getIcalObjectInstance(response);
            var mailOpt = {
                to: req.body.emailAddress,
                subject: 'Event Invitation',
                text: 'Hello you have been invite in event',
                html: `<!DOCTYPE html><head> </head> <body><h1> Hello User, You have been invited in event name: ${response.eventname} On Date : ${response.date} time : ${response.time}</h1></body></html>`
            };

            if (calander) {
                let alternatives = {
                    "Content-Type": "text/calendar",
                    "method": "REQUEST",
                    "content": new Buffer(calander.toString()),
                    "component": "VEVENT",
                    "Content-Class": "urn:content-classes:calendarmessage"
                }
                mailOpt['alternatives'] = alternatives;
                mailOpt['alternatives']['contentType'] = 'text/calendar'
                mailOpt['alternatives']['content']
                    = new Buffer(calander.toString())
            };

            smtpTransport.sendMail(mailOpt, function (error, response) {
                if (error) {
                    console.log(error);
                } else {
                    console.log("Message sent: ", response);
                    res.redirect('event/list');
                }
            });
        };
    });
};

function getIcalObjectInstance(obj) {
    const cal = ical({ name: 'my first iCal' });
    cal.createEvent({
        start: moment(obj.date + ' ' + obj.time),        
        // end: moment(1, 'days'),             
        summary: '',
        url: '',        
        description: '',
        location: 'Ahmedabad',           
        organizer: {            
            name: obj.eventname,
            email: 'luharnoman409@gmail.com'
        },
    });
    return cal;
}

module.exports = { insertData, updateData, sendInvite }