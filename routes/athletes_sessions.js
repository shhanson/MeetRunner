const bodyParser = require('body-parser');
const ev = require('express-validation');
const express = require('express');

const _ = require('../tools/tools');
const knex = require('../knex');
// const validations = require('../validations/sessions');

const router = express.Router();

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
  extended: false,
}));

// GET all athletes in the specified session
router.get('/:event_id/sessions/:session_id/athletes', (req, res, next) => {
  // Check logged in
  const eventID = Number.parseInt(req.params.event_id, 10);
  const sessionID = Number.parseInt(req.params.session_id, 10);

  if (!_.isValidID(eventID) || !_.isValidID(sessionID)) {
    res.status(400).send({ error: 'Bad request!' });
  }

  if (req.session.id) {
    knex.select('user_id').from('users_events')
      .where('event_id', eventID)
      .first()
      .then((userID) => {
        if (userID.user_id === req.session.id) {
          knex('athletes_sessions')
            .join('athletes', 'athletes_sessions.athlete_id', 'athletes.id')
            .join('sessions', 'athletes_sessions.session_id', 'sessions.id')
            .where('sessions.id', sessionID)
            .returning('athletes.*')
            .then((data) => {
              res.json(data);
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

// DELETE an athlete from a session
router.delete('/:event_id/sessions/:session_id/athletes/:athlete_id/remove', (req, res, next) => {
  // Check logged in
  const eventID = Number.parseInt(req.params.event_id, 10);
  const sessionID = Number.parseInt(req.params.session_id, 10);
  const athleteID = Number.parseInt(req.params.athlete_id, 10);

  if (!_.isValidID(eventID) || !_.isValidID(sessionID) || !_.isValidID(athleteID)) {
    res.status(400).send({ error: 'Bad request! ' });
  }

  if (req.session.id) {
    knex.select('user_id').from('users_events')
      .where('event_id', eventID)
      .first()
      .then((userID) => {
        if (userID.user_id === req.session.id) {
          knex('athletes_sessions')
            .where('athlete_id', athleteID)
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
      });
  } else {
    res.status(401).send({ error: 'Not authorized!' });
  }
});

// Add an athlete to the session
router.post('/:event_id/sessions/:session_id/athletes/:athlete_id/add', (req, res, next) => {
  // Check logged in
  const eventID = Number.parseInt(req.params.event_id, 10);
  const sessionID = Number.parseInt(req.params.session_id, 10);
  const athleteID = Number.parseInt(req.params.athlete_id, 10);

  if (!_.isValidID(eventID) || !_.isValidID(sessionID) || !_.isValidID(athleteID)) {
    res.status(400).send({ error: 'Bad request! ' });
  }

  if (req.session.id) {
    knex('athletes_sessions')
      .insert({
        athlete_id: athleteID,
        session_id: sessionID,
      })
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
});

// EDIT an athlete's session
router.put('/:event_id/sessions/:session_id/athletes/:athlete_id/edit', (req, res, next) => {
  const eventID = Number.parseInt(req.params.event_id, 10);
  const sessionID = Number.parseInt(req.params.session_id, 10);
  const athleteID = Number.parseInt(req.params.athlete_id, 10);

  if (!_.isValidID(eventID) || !_.isValidID(sessionID) || !_.isValidID(athleteID)) {
    res.status(400).send({ error: 'Bad request! ' });
  }

  if (req.session.id) {
    knex('athletes_sessions')
      .where('athlete_id', athleteID)
      .del()
      .then(() => knex('athletes_sessions')
        .insert({
          athlete_id: athleteID,
          session_id: req.body.session_id,
        })
        .returning(['athlete_id', 'session_id']))
      .then((data) => {
        res.json(data[0]);
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
