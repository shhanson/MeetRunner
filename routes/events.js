const bodyParser = require('body-parser');
const ev = require('express-validation');
const express = require('express');

const _ = require('../tools/tools');
const knex = require('../knex');
const validations = require('../validations/events');

const router = express.Router();

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
  extended: false,
}));

function deleteEventReferences(eventID) {
  return Promise.all([
    knex('events_athletes').where('event_id', eventID).del(),
    knex('sessions').where('event_id', eventID).del(),
    knex('users_events').where('event_id', eventID).del(),
  ]);
}

// GET all events
router.get('/', (req, res, next) => {
  knex('events')
    .then((allEvents) => {
      res.json(allEvents);
    })
    .catch((err) => {
      console.error(err);
      next(err);
    });
});

// GET an event with a given ID
router.get('/:id', (req, res, next) => {
  const eventID = Number.parseInt(req.params.id, 10);
  if (_.isValid(eventID)) {
    knex('events')
      .where('id', eventID)
      .first()
      .then((eventInfo) => {
        res.json(eventInfo);
      })
      .catch((err) => {
        console.error(err);
        next(err);
      });
  } else {
    res.status(400).send({ error: 'Bad request!' });
  }
});

// POST a new Event
router.post('/events', ev(validations.post), (req, res, next) => {
  if (req.session.id) {
    knex('events')
      .insert({
        title: req.body.title,
        organizer: req.body.organizer,
        sanction_id: req.body.sanction_id,
        start_date: req.body.start_date,
        end_date: req.body.end_date,
        street_address: req.body.street_address,
        city: req.body.city,
        state: req.body.state,
        zip_code: req.body.zip_code,
        phone: req.body.phone,
        email: req.body.email,
        description: req.body.description,
        entry_fee_cents: req.body.entry_fee_cents,
      })
      .returning('id')
      .then((id) => {
        knex('users_events')
          .insert({
            user_id: req.session.id,
            event_id: id,
          })
          .then(() => {
            res.sendStatus(200);
          });
      })
      .catch((err) => {
        console.error(err);
        next(err);
      });
  } else {
    res.status(401).send({ error: 'Not authorized!' });
  }
});

// Edit a single event
router.put('/events/:id', ev(validations.event_put), (req, res, next) => {
  const userID = req.session.id;
  const eventID = Number.parseInt(req.params.id, 10);

  if (_.isValidID(userID) && _.isValidID(eventID)) {
    // First check if the user owns the event
    knex('users_events')
      .where('event_id', eventID)
      .then((data) => {
        if (data.user_id === userID) {
          knex('events')
            .where('id', eventID)
            .update({
              title: req.body.title,
              organizer: req.body.organizer,
              sanction_id: req.body.sanction_id,
              start_date: req.body.start_date,
              end_date: req.body.end_date,
              street_address: req.body.street_address,
              city: req.body.city,
              state: req.body.state,
              zip_code: req.body.zip_code,
              phone: req.body.phone,
              email: req.body.email,
              description: req.body.description,
              entry_fee_cents: req.body.entry_fee_cents,
            }).then(() => {
              res.sendStatus(200);
            })
            .catch((err) => {
              console.error(err);
              next(err);
            });
        } else {
          res.status(401).send({ error: 'Not authorized!' });
        }
      })
      .catch((err) => {
        console.error(err);
        next();
      });
  } else {
    res.status(401).send({ error: 'Not authorized!' });
  }
});

// DELETE an event
router.delete('/events/:id', (req, res, next) => {
  const userID = req.session.id;
  const eventID = Number.parseInt(req.params.id, 10);
  if (_.isValidID(userID) && _.isValidID(eventID)) {
    // Must delete foreign keys in other tables that reference the event first
    deleteEventReferences(eventID).then(() => {
      knex('events')
        .where('id', eventID)
        .del()
        .then(() => {
          res.sendStatus(200);
        })
        .catch((err) => {
          console.error(err);
          next(err);
        });
    })
      .catch((err) => {
        console.error(err);
        next(err);
      });
  } else {
    res.status(400).send({ error: 'Bad request!' });
  }
});

module.exports = router;
