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

function getNumAthletesForSession(sessionID) {
  return knex('sessions')
    .where('id', sessionID)
    .join('athletes_sessions', 'athletes_sessions.session_id', 'sessions.id')
    .count('athletes_sessions.session_id')
    .first()
    .then(count => ({ session_id: sessionID, count: count.count }));
}

// GET all sessions within an event
router.get('/:event_id/sessions', (req, res, next) => {
  const eventID = Number.parseInt(req.params.event_id, 10);
  if (_.isValidID(eventID)) {
    knex('sessions')
      .where('event_id', eventID)
      .then((sessions) => {
        const promises = [];
        sessions.forEach((session) => {
          promises.push(getNumAthletesForSession(session.id));
        });

        Promise.all(promises).then((counts) => {
          const sessionsIndexed = sessions.reduce((a, z) => {
            a[z.id] = z;
            return a;
          }, {});

          counts.forEach((count) => {
            sessionsIndexed[count.session_id].numAthletes = count.count;
          });

          const result = [];
          Object.keys(sessionsIndexed).forEach((key) => {
            result.push(sessionsIndexed[key]);
          });

          res.json(result);
        });
        // res.json(sessions);
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
  }

  if (req.session.id) {
    // Check if the logged in user owns the event

    knex.select('user_id').from('users_events')
      .where('event_id', eventID)
      .first()
      .then((userID) => {
        if (userID.user_id === req.session.id) {
          return knex('sessions')
            .insert({
              event_id: eventID,
              date: req.body.date,
              weigh_time: req.body.weigh_time,
              start_time: req.body.start_time,
              description: req.body.description,
            })
            .returning('*');
        }
        return res.status(401).send({ error: 'Not authorized!' });
      })
      .then((newSessionData) => {
        res.json(newSessionData[0]);
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
      })
      .first()
      .then((session) => {
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
  }

  if (req.session.id) {
    // Check if user owns the event with the session
    knex.select('user_id').from('users_events')
      .where('event_id', eventID)
      .first()
      .then((userID) => {
        if (userID.user_id === req.session.id) {
          return knex('sessions')
            .where('id', sessionID)
            .update({
              date: req.body.date,
              weigh_time: req.body.weigh_time,
              start_time: req.body.start_time,
              description: req.body.description,
            })
            .returning('*');
        }
        return res.status(401).send({ error: 'Not authorized!' });
      })
      .then((editedSession) => {
        res.json(editedSession[0]);
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
router.delete('/:event_id/sessions/:session_id/delete', (req, res, next) => {
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
          knex('sessions')
            .where('id', sessionID)
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
