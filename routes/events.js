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

// GET all events
router.get('/', (req, res, next) => {
  knex('events')
    .then((allEvents) => {
      res.json(allEvents);
      return;
    })
    .catch((err) => {
      console.error(err);
      next(err);
    });
});

// GET an event with a given ID
router.get('/:id', (req, res, next) => {
  const eventID = Number.parseInt(req.params.id, 10);
  if (_.isValidID(eventID)) {
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
router.post('/new', ev(validations.post), (req, res, next) => {
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
      .returning('*')
      .then((newEventData) => {
        knex('users_events')
          .insert({
            user_id: req.session.id,
            event_id: newEventData[0].id,
          });
        return new Promise((resolve) => {
          resolve(newEventData[0]);
        });
      })
      .then((newEventData) => {
        res.json(newEventData);
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
router.put('/:id/edit', ev(validations.put), (req, res, next) => {
  // const userID = req.session.id;
  const eventID = Number.parseInt(req.params.id, 10);

  if (!_.isValidID(eventID)) {
    res.status(400).send({ error: 'Bad request!' });
  }

  if (req.session.id) {
    // First check if the user owns the event
    knex.select('user_id').from('users_events')
      .where('event_id', eventID)
      .first()
      .then((userID) => {
        if (userID.user_id === req.session.id) {
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
            })
            .returning('*')
            .then((eventInfo) => {
              res.json(eventInfo[0]);
            })
            .catch((err) => {
              console.error(err);
              next();
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
router.delete('/:id/delete', (req, res, next) => {
  const eventID = Number.parseInt(req.params.id, 10);

  if (!_.isValidID(eventID)) {
    res.status(400).send({ error: 'Bad request!' });
  }

  if (req.session.id) {
    // Check if the logged in user owns the event

    knex.select('user_id').from('users_events')
      .where('event_id', eventID)
      .first()
      .then((userID) => {
        if (req.session.id === userID.user_id) {
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
        } else {
          res.status(401).send({ error: 'Not authorized!' });
        }
      })
      .catch((err) => {
        console.error(err);
        next(err);
      });
  } else {
    res.status(401).send({ error: 'Not authorized!' });
  }
});

module.exports = router;
