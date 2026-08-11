require('dotenv').config();
const express = require('express');
// const ejs = require('ejs');
const mongoose = require('mongoose');
const Event = require('./models/event.js');

const app = express();
app.use(express.urlencoded({ extended: true }));

const dbURL = process.env.dbURL;

mongoose
    .connect(dbURL)
    .then(() => {
        console.log('Connected to MongoDB');
        // start the server
        app.listen(process.env.port, () => {
            console.log('Server started and running on port', process.env.port);
        });
    })
    .catch((err) => {
        console.error('Could not connect to MongoDB:', err);
    });

// READ: fetch all events
app.get('/', (req, res) => {
    Event.find()
        .then((result) => {
            console.log('res', result);
            return res.send(result);

        })
        .catch((err) => {
            console.err(err);
            return err;
        })
})

// CREATE: create an event
app.post('/submit-event', (req, res) => {
    const event = new Event(req.body);
    event.save()
        .then((result) => {
            res.send('Event saved successfully!');
        })
        .catch((err) => {
            console.error(err);
            res.send(err);
        });
});

// UPDATE: update an event
app.patch('/update-event/:id', (req, res) => {
    const eventId = req.params.id;
    const updatedEventPayload = req.body;
    Event.findByIdAndUpdate(eventId, updatedEventPayload)
        .then((result) => {
            if(result) {
                console.log('DEBUG:: result', result);
                res.send('Event updated successfully');
            }
            else {
                res.send('Event not found');
            }
        })
        .catch((err) => {
            console.error(err);
        })
})


// DELETE: delete an event data
app.delete('/delete-event/:id', (req, res) => {
    const eventId = req.params.id;
    Event.findByIdAndDelete(eventId)
        .then((result) => {
            if(result) 
                return res.send('Event deleted successfully');
            return res.send('Event not found');
        })
        .catch((err) => {
            console.error(err);
            return err;
        })
})

