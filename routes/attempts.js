const bodyParser = require('body-parser');
const ev = require('express-validation');
const express = require('express');

const _ = require('../tools/tools');
const knex = require('../knex');
const validations = require('../validations/attempts');

const router = express.Router();

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
  extended: false,
}));

router.get('/:event_id/athletes/:athlete_id/attempts', (req, res, next) => {
  const eventID = Number.parseInt(req.params.event_id, 10);
  const athleteID = Number.parseInt(req.params.athlete_id, 10);

  if (!_.isValidID(eventID) || !_.isValidID(athleteID)) {
    res.status(400).send({ error: 'Bad request! ' });
  }

  if (req.session.id) {
    knex.select('user_id').from('users_events')
      .where('event_id', eventID)
      .first()
      .then((userID) => {
        if (userID.user_id === req.session.id) {
          knex('attempts')
            .where('athlete_id', athleteID)
            .then((attempts) => {
              res.json(attempts);
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

router.get('/:event_id/athletes/:athlete_id/attempts/:attempt_id', (req, res, next) => {
  const eventID = Number.parseInt(req.params.event_id, 10);
  const athleteID = Number.parseInt(req.params.athlete_id, 10);
  const attemptID = Number.parseInt(req.params.attempt_id, 10);

  if (!_.isValidID(eventID) || !_.isValidID(athleteID) || !_.isValidID(attemptID)) {
    res.status(400).send({ error: 'Bad request! ' });
  }

  if (req.session.id) {
    knex.select('user_id').from('users_events')
      .where('event_id', eventID)
      .first()
      .then((userID) => {
        if (userID.user_id === req.session.id) {
          knex('attempts')
            .where('id', attemptID)
            .then((attempt) => {
              res.json(attempt);
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

router.post('/:event_id/athletes/:athlete_id/attempts/new', ev(validations.post), (req, res, next) => {
  const eventID = Number.parseInt(req.params.event_id, 10);
  const athleteID = Number.parseInt(req.params.athlete_id, 10);

  if (!_.isValidID(eventID) || !_.isValidID(athleteID)) {
    res.status(400).send({ error: 'Bad request! ' });
  }

  if (req.session.id) {
    knex.select('user_id').from('users_events')
      .where('event_id', eventID)
      .first()
      .then((userID) => {
        if (userID.user_id === req.session.id) {
          knex('attempts')
            .insert({
              type: req.body.type,
              athlete_id: athleteID,
              attempt_num: req.body.attempt_num,
              weight: req.body.weight,
            })
            .returning('*')
            .then((attempt) => {
              res.json(attempt[0]);
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
    res.status(401).send({ error: 'Not authorized! ' });
  }
});

router.put('/:event_id/athletes/:athlete_id/attempts/:attempt_id/edit', ev(validations.put), (req, res, next) => {
  const eventID = Number.parseInt(req.params.event_id, 10);
  const athleteID = Number.parseInt(req.params.athlete_id, 10);
  const attemptID = Number.parseInt(req.params.attempt_id, 10);

  if (!_.isValidID(eventID) || !_.isValidID(athleteID) || !_.isValidID(attemptID)) {
    res.status(400).send({ error: 'Bad request! ' });
  }

  if (req.session.id) {
    knex.select('user_id').from('users_events')
      .where('event_id', eventID)
      .first()
      .then((userID) => {
        if (userID.user_id === req.session.id) {
          knex('attempts')
            .where('id', attemptID)
            .update({
              type: req.body.type,
              athlete_id: athleteID,
              attempt_num: req.body.attempt_num,
              weight: req.body.weight,
            })
            .returning('*')
            .then((attempt) => {
              res.json(attempt[0]);
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
    res.status(401).send({ error: 'Not authorized! ' });
  }
});

router.delete('/:event_id/athletes/:athlete_id/attempts/:attempt_id/delete', (req, res, next) => {
  const eventID = Number.parseInt(req.params.event_id, 10);
  const athleteID = Number.parseInt(req.params.athlete_id, 10);
  const attemptID = Number.parseInt(req.params.attempt_id, 10);

  if (!_.isValidID(eventID) || !_.isValidID(athleteID) || !_.isValidID(attemptID)) {
    res.status(400).send({ error: 'Bad request! ' });
  }

  if (req.session.id) {
    knex.select('user_id').from('users_events')
      .where('event_id', eventID)
      .first()
      .then((userID) => {
        if (userID.user_id === req.session.id) {
          knex('attempts')
            .where('id', attemptID)
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
    res.status(401).send({ error: 'Not authorized! ' });
  }
});

module.exports = router;
