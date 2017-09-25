const bodyParser = require('body-parser');
const ev = require('express-validation');
const express = require('express');
const paypal = require('paypal-rest-sdk');

const _ = require('../tools/tools');
const knex = require('../knex');
const validations = require('../validations/athletes');

const router = express.Router();


router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
  extended: false,
}));

// function createPaypalJSON(payeeEmail, entryFee, description) {
//   return {
//     intent: 'sale',
//     payer: {
//       payment_method: 'paypal',
//     },
//     redirect_urls: {
//       return_url: '/',
//       cancel_url: '/',
//     },
//     transactions: [{
//       amount: {
//         total: entryFee,
//         currency: 'USD',
//       },
//       payee: {
//         email: payeeEmail,
//       },
//       description,
//     }],
//   };
// }

router.delete('/:event_id/athletes/:athlete_id/delete', (req, res, next) => {
  const eventID = Number.parseInt(req.params.event_id, 10);
  const athleteID = Number.parseInt(req.params.athlete_id, 10);

  if (!_.isValidID(eventID) || !_.isValidID(athleteID)) {
    res.status(400).send({ error: 'Bad request!' });
  }

  if (req.session.id) {
    knex.select('user_id').from('users_events')
      .where('event_id', eventID)
      .first()
      .then((userID) => {
        if (userID.user_id === req.session.id) {
          knex('athletes')
            .where('id', athleteID)
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

// PUT request for specified athlete within an event
router.put('/:event_id/athletes/:athlete_id/edit', ev(validations.put), (req, res, next) => {
  // Check logged in
  const eventID = Number.parseInt(req.params.event_id, 10);
  const athleteID = Number.parseInt(req.params.athlete_id, 10);

  if (!_.isValidID(eventID) || !_.isValidID(athleteID)) {
    res.status(400).send({ error: 'Bad request!' });
  }

  if (req.session.id) {
    knex.select('user_id').from('users_events')
      .where('event_id', eventID)
      .first()
      .then((userID) => {
        if (userID.user_id === req.session.id) {
          knex('athletes')
            .where('id', athleteID)
            .update({
              email: req.body.email,
              first_name: req.body.first_name,
              last_name: req.body.last_name,
              usaw_id: req.body.usaw_id,
              year_of_birth: req.body.year_of_birth,
              gender_id: req.body.gender_id,
              lot_num: req.body.lot_num,
              bodyweight_grams: req.body.bodyweight_grams,
              division_id: req.body.division_id,
              category_id: req.body.category_id,
              entry_total: req.body.entry_total,
              total: req.body.total,
            })
            .returning('*')
            .then((athleteInfo) => {
              res.json(athleteInfo[0]);
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

router.get('/:event_id/athletes/sessionless', (req, res, next) => {
  const eventID = Number.parseInt(req.params.event_id, 10);
  if (!_.isValidID(eventID)) {
    res.status(400).send({ error: 'Bad request!' });
  }


  knex.select('user_id').from('users_events')
    .where('event_id', eventID)
    .first()
    .then((userID) => {
      if (userID.user_id === req.session.id) {
        return knex('events_athletes')
          .join('athletes', 'id', 'events_athletes.athlete_id')
          .where('events_athletes.event_id', eventID);
      }
      res.status(401).send({ error: 'Not authorized!' });
    })
    .then((athletes) => {
      knex.select('athlete_id')
        .from('athletes_sessions')
        .then((athletesInSessions) => {
          const athletesInSessionsArray = athletesInSessions.map(obj => obj.athlete_id);

          const sessionlessAthletes = [];
          for (let i = 0; i < athletes.length; i++) {
            if (!athletesInSessionsArray.includes(athletes[i].id)) {
              sessionlessAthletes.push(athletes[i]);
            }
          }

          const promises = [];
          sessionlessAthletes.forEach((athlete) => {
            promises.push(knex('athletes')
              .where('id', athlete.id)
              .first());
          });

          Promise.all(promises).then((result) => {
            res.json(result);
          });
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
});

router.get('/:event_id/athletes/:athlete_id/session', (req, res, next) => {
  const eventID = Number.parseInt(req.params.event_id, 10);
  const athleteID = Number.parseInt(req.params.athlete_id, 10);

  if (!_.isValidID(eventID) || !_.isValidID(athleteID)) {
    res.status(400).send({ error: 'Bad request!' });
  }

  knex.select('session_id').from('athletes_sessions')
    .where('athlete_id', athleteID)
    .then((data) => {
      res.json(data[0].session_id);
    })
    .catch((err) => {
      console.error(err);
      res.json(-1);
    });
});

// GET the requested athlete from an event
router.get('/:event_id/athletes/:athlete_id', (req, res, next) => {
  const eventID = Number.parseInt(req.params.event_id, 10);
  const athleteID = Number.parseInt(req.params.athlete_id, 10);

  if (!_.isValidID(eventID) || !_.isValidID(athleteID)) {
    res.status(400).send({ error: 'Bad request!' });
  }

  if (req.session.id) {
    knex.select('user_id').from('users_events')
      .where('event_id', eventID)
      .first()
      .then((userID) => {
        if (userID.user_id === req.session.id) {
          return knex('athletes')
            .where('id', athleteID)
            .first();
        }
        res.status(401).send({ error: 'Not authorized!' });
      })
      .then((athleteInfo) => {
        res.json(athleteInfo);
      })
      .catch((err) => {
        console.error(err);
        next(err);
      });
  } else {
    res.status(401).send({ error: 'Not authorized!' });
  }
});


router.post('/:event_id/athletes/register', ev(validations.post), (req, res, next) => {
  const eventID = Number.parseInt(req.params.event_id, 10);
  if (!_.isValidID(eventID)) {
    res.status(400).send({ error: 'Bad request!' });
  }

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
      total: req.body.total,
      lot_num: req.body.lot_num,
      bodyweight_grams: req.body.bodyweight_grams,
      coach: req.body.coach,
      club: req.body.club,
    })
    .returning('id')
    .then((athleteID) => {
      knex('events_athletes')
        .insert({
          event_id: eventID,
          athlete_id: athleteID[0],
        })
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
});

router.post('/:event_id/athletes/new', ev(validations.post), (req, res, next) => {
  const eventID = Number.parseInt(req.params.event_id, 10);
  if (!_.isValidID(eventID)) {
    res.status(400).send({ error: 'Bad request!' });
  }

  if (req.session.id) {
    knex.select('user_id').from('users_events')
      .where('event_id', eventID)
      .first()
      .then((userID) => {
        if (userID.user_id === req.session.id) {
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
              total: req.body.total,
              lot_num: req.body.lot_num,
              bodyweight_grams: req.body.bodyweight_grams,
              coach: req.body.coach,
              club: req.body.club,
            })
            .returning('*')
            .then((athleteInfo) => {
              knex('events_athletes')
                .insert({
                  event_id: eventID,
                  athlete_id: athleteInfo[0].id,
                });
              return new Promise((resolve) => {
                resolve(athleteInfo[0]);
              });
            })
            .then((athleteInfo) => {
              res.json(athleteInfo);
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

// GET all athletes registered for an event
router.get('/:event_id/athletes', (req, res, next) => {
  const eventID = Number.parseInt(req.params.event_id, 10);
  if (!_.isValidID(eventID)) {
    res.status(400).send({ error: 'Bad request!' });
  }


  knex.select('user_id').from('users_events')
    .where('event_id', eventID)
    .first()
    .then((userID) => {
      if (userID.user_id === req.session.id) {
        return knex('events_athletes')
          .join('athletes', 'id', 'events_athletes.athlete_id')
          .where('events_athletes.event_id', eventID);
      }
      res.status(401).send({ error: 'Not authorized!' });
    })
    .then((athletes) => {
      res.json(athletes);
    })
    .catch((err) => {
      console.error(err);
      next(err);
    });
});

// DELETE an athlete from an event


module.exports = router;
