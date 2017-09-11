const bodyParser = require('body-parser');
const ev = require('express-validation');
const express = require('express');

const _ = require('../tools/tools');
const knex = require('../knex');
const validations = require('../validations/sessions');

const router = express.Router();

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
  extended: false,
}));

// GET all sessions within an event
router.get('/:event_id/sessions', (req, res, next) => {
  const eventID = Number.parseInt(req.params.event_id, 10);
  if (_.isValidID(eventID)) {
    knex('sessions')
      .where('event_id', eventID)
      .then((sessions) => {
        res.json(sessions);
      })
      .catch((err) => {
        console.error(err);
        next(err);
      });
  } else {
    res.status(400).send({ error: 'Bad request!' });
  }
});

// POST a new session to the event
router.post('/:event_id/sessions/new', ev(validations.post), (req, res, next) => {
  const eventID = Number.parseInt(req.params.event_id, 10);

  if (!_.isValidID(eventID)) {
    res.status(400).send({ error: 'Bad request!' });
  } else if (req.session.id) {
    // Check if the logged in user owns the event
    knex('users_events')
      .where('event_id', eventID)
      .returning('user_id')
      .then((userID) => {
        if (userID === req.session.id) {
          return knex('sessions')
            .insert({
              event_id: eventID,
              date: req.body.date,
              weigh_time: req.body.weigh_time,
              start_time: req.body.start_time,
              description: req.body.description,
            });
        }
        return res.status(401).send({ error: 'Not authorized!' });
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

// GET the requested session from an event
router.get('/:event_id/sessions/:session_id', (req, res, next) => {
  const eventID = Number.parseInt(req.params.event_id, 10);
  const sessionID = Number.parseInt(req.params.session_id, 10);

  if (!_.isValidID(eventID) || !_.isValidID(sessionID)) {
    res.status(400).send({ error: 'Bad request!' });
  } else {
    knex('sessions')
      .where({
        id: sessionID,
        event_id: eventID,
      }).then((session) => {
        res.json(session);
      })
      .catch((err) => {
        console.error(err);
        next(err);
      });
  }
});

// PUT request for specified session within an event
router.put('/:event_id/sessions/:session_id/edit', ev(validations.put), (req, res, next) => {
  const eventID = Number.parseInt(req.params.event_id, 10);
  const sessionID = Number.parseInt(req.params.session_id, 10);

  if (!_.isValidID(eventID) || !_.isValidID(sessionID)) {
    res.status(400).send({ error: 'Bad request!' });
  } else if (req.session.id) {
    // Check if user owns the event with the session
    knex('users_events')
      .where('event_id', eventID)
      .returning('user_id')
      .then((userID) => {
        if (userID === req.session.id) {
          return knex('sessions')
            .where('id', sessionID)
            .update({
              date: req.body.date,
              weigh_time: req.body.weigh_time,
              start_time: req.body.start_time,
              description: req.body.description,
            });
        }
        return res.status(401).send({ error: 'Not authorized!' });
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

// DELETE a session within an event
router.delete('/:event_id/sessions/:session_id', (req, res, next) => {
  const eventID = Number.parseInt(req.params.event_id, 10);
  const sessionID = Number.parseInt(req.params.session_id, 10);

  if (!_.isValidID(eventID) || !_.isValidID(sessionID)) {
    res.status(400).send({ error: 'Bad request!' });
  } else if (req.session.id) {
    knex('users_events')
      .where('event_id', eventID)
      .returning('user_id')
      .then((userID) => {
        if (userID === req.session.id) {
          return knex('sessions')
            .where('id', sessionID)
            .del();
        }
        return res.status(401).send({ error: 'Not authorized!' });
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

module.exports = router;
