const express = require('express');
var router = express.Router();
const mongoose = require('mongoose');

var { insertData, updateData, sendInvite } = require('./event-functions.js');

const Events = mongoose.model('events');

router.get('/', (req, res) => {
    res.render('event-folder/add-or-edit', {
        viewTitle: "Add Events"
    });
});

router.post('/', (req, res) => {
    if (req.body.search) {
        Events.find({ eventname: req.body.eventname }, (err, response) => {
            if (err) {
                console.log(`Error in getting event date : ` + err);
            } else {
                res.render('event-folder/event-list', {
                    list: response,
                });
            };
        });
    } else if (req.body.emailAddress) {
        sendInvite(req, res)
    } else if (req.body._id == '') {
        insertData(req, res);
    } else {
        updateData(req, res);
    };
});

router.get('/list', (req, res) => {
    Events.find((err, docs) => {
        if (err) {
            console.log(`Error in getting event list : ` + err);
        } else {
            res.render('event-folder/event-list', {
                list: docs,
            });
        };
    });
});

router.get('/:id', (req, res) => {
    Events.findById(req.params.id, (err, response) => {
        if (err) {
            console.log(`Error in getting event date : ` + err);
        } else {
            res.render('event-folder/add-or-edit', {
                viewTitle: "Edit Events",
                events: response
            });
        };
    });
});

router.get('/delete/:id', (req, res) => {
    Events.findByIdAndRemove(req.params.id, (err, response) => {
        if (err) {
            console.log(`Error in removing event : ` + err);
        } else {
            res.redirect('/event/list');
        };
    });
});

router.get('/invite/:id', (req, res) => {
    Events.findById(req.params.id, (err, response) => {
        if (err) {
            console.log(`Error in getting event date : ` + err);
        } else {
            res.render('event-folder/invite-user', {
                viewTitle: "Invite User",
                events: response
            });
        };
    });
});

module.exports = router;