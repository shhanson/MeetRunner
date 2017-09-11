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

function deleteSessionReferences(sessionID) {
  return knex('athletes_sessions').where('session_id', sessionID).del();
}

// GET all sessions within an event
router.get('/:event_id/sessions', (req, res, next) => {
  const eventID = Number.parseInt(req.params.event_id, 10);
  if (_.isValidID(eventID)) {
    knex('sessions')
      .where('event_id', eventID)
      .then((sessions) => {
        res.json(sessions);
        return;
      })
      .catch((err) => {
        console.error(err);
        next(err);
      });
  } else {
    res.status(400).send({ error: 'Bad request!' });
    return;
  }
});

// POST a new session to the event
router.post('/:event_id/sessions/new', ev(validations.post), (req, res, next) => {
  const eventID = Number.parseInt(req.params.event_id, 10);

  if (!_.isValidID(eventID)) {
    res.status(400).send({ error: 'Bad request!' });
    return;
  }

  // Check logged in
  if (req.session.id) {
    // Check if the logged in user owns the event
    knex('users_events')
      .where('event_id', eventID)
      .returning('user_id')
      .then((userID) => {
        if (userID === req.session.id) {
          knex('sessions')
            .insert({
              event_id: eventID,
              date: req.body.date,
              weigh_time: req.body.weigh_time,
              start_time: req.body.start_time,
              description: req.body.description,
            })
            .then(() => {
              res.sendStatus(200);
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

// GET the requested session from an event
router.get('/:event_id/sessions/:session_id', (req, res, next) => {
  const eventID = Number.parseInt(req.params.event_id, 10);
  const sessionID = Number.parseInt(req.params.session_id, 10);

  if (!_.isValidID(eventID) || !_.isValidID(sessionID)) {
    res.status(400).send({ error: 'Bad request!' });
    return;
  }

  knex('sessions')
    .where({
      id: sessionID,
      event_id: eventID,
    }).then((session) => {
      res.json(session);
      return;
    })
    .catch((err) => {
      console.error(err);
      next(err);
    });
});

// PUT request for specified session within an event
router.put('/:event_id/sessions/:session_id/edit', ev(validations.put), (req, res, next) => {
  const eventID = Number.parseInt(req.params.event_id, 10);
  const sessionID = Number.parseInt(req.params.session_id, 10);

  if (!_.isValidID(eventID) || !_.isValidID(sessionID)) {
    res.status(400).send({ error: 'Bad request!' });
    return;
  }

  if (req.session.id) {
    // Check if user owns the event with the session
    knex('users_events')
      .where('event_id', eventID)
      .returning('user_id')
      .then((userID) => {
        if (userID === req.session.id) {
          knex('sessions')
            .where('id', sessionID)
            .update({
              date: req.body.date,
              weigh_time: req.body.weigh_time,
              start_time: req.body.start_time,
              description: req.body.description,
            }).then(() => {
              res.sendStatus(200);
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

// DELETE a session within an event
router.delete('/:event_id/sessions/:session_id', (req, res, next) => {
  const eventID = Number.parseInt(req.params.event_id, 10);
  const sessionID = Number.parseInt(req.params.session_id, 10);

  if (!_.isValidID(eventID) || !_.isValidID(sessionID)) {
    res.status(400).send({ error: 'Bad request!' });
    return;
  }

  if (req.session.id) {
    knex('users_events')
      .where('event_id', eventID)
      .returning('user_id')
      .then((userID) => {
        if (userID === req.session.id) {
          deleteSessionReferences(sessionID)
            .then(() => {
              knex('sessions')
                .where('id', sessionID)
                .del()
                .then(() => {
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

module.exports = router;
