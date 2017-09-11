const bodyParser = require('body-parser');
const ev = require('express-validation');
const express = require('express');

const _ = require('../tools/tools');
const knex = require('../knex');
const validations = require('../validations/athletes');

const router = express.Router();

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
  extended: false,
}));

// GET all athletes registered for an event
router.get('/:event_id/athletes', (req, res, next) => {
  const eventID = Number.parseInt(req.params.event_id, 10);
  if (!_.isValidID(eventID)) {
    res.status(400).send({ error: 'Bad request!' });
    return;
  }

  if (req.session.id) {
    knex('users_events')
      .where('event_id', eventID)
      .returning('user_id')
      .then((userID) => {
        if (userID === req.session.id) {
          knex('events_athletes')
            .join('athletes', 'id', 'events_athletes.athlete_id')
            .where('events_athletes.event_id', eventID)
            .then((athletes) => {
              res.json(athletes);
              return;
            })
            .catch((err) => {
              console.error(err);
              next(err);
            });
        } else {
          res.status(401).send({ error: 'Not authorized!' });
          return;
        }
      })
      .catch((err) => {
        console.error(err);
        next(err);
      });
  } else {
    res.status(401).send({ error: 'Not authorized!' });
    return;
  }
});

// POST a new athlete to the event
router.post('/:event_id/athletes/new', ev(validations.post), (req, res, next) => {
  const eventID = Number.parseInt(req.params.event_id, 10);
  if (!_.isValidID(eventID)) {
    res.status(400).send({ error: 'Bad request!' });
    return;
  }

  if (req.session.id) {
    knex('users_events')
      .where('event_id', eventID)
      .returning('user_id')
      .then((userID) => {
        if (userID === req.session.id) {
          knex('athletes')
            .insert({
              email: req.body.email,
              first_name: req.body.first_name,
              last_name: req.body.last_name,
              usaw_id: req.body.usaw_id,
              year_of_birth: req.body.year_of_birth,
              gender_id: req.body.gender_id,
              division_id: req.body.division_id,
              category_id: req.body.category_id,
              entry_total: req.body.entry_total,
            })
            .returning('id')
            .then((athleteID) => {
              knex('events_athletes')
                .insert({
                  event_id: eventID,
                  athlete_id: athleteID,
                }).then(() => {
                  res.sendStatus(200);
                  return;
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
          res.status(401).send({ error: 'Not authorized!' });
          return;
        }
      })
      .catch((err) => {
        console.error(err);
        next(err);
      });
  } else {
    res.status(401).send({ error: 'Not authorized!' });
    return;
  }
});

// GET the requested athlete from an event
router.get('/:event_id/athletes/:athlete_id', (req, res, next) => {
  // Check logged in

});

// PUT request for specified athlete within an event
router.put('/:event_id/athletes/:athlete_id/edit', ev(validations.put), (req, res, next) => {
  // Check logged in
});

// DELETE an athlete from an event
router.delete('/:event_id/athletes/:athlete_id', (req, res, next) => {
  // Check logged in

  // Delete athlete from events_athletes
  // Delete athlete from athletes_sessions
  // Delete athlete attempts
  // Delete athlete from athletes

});

module.exports = router;
