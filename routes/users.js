const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const ev = require('express-validation');
const express = require('express');

const _ = require('../tools/tools');
const knex = require('../knex');
const validations = require('../validations/users');

const router = express.Router();
const saltRounds = 11;

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
  extended: false,
}));

function getEvents(userID) {
  return knex.select('events.*').from('users_events').join('events', 'users_events.event_id', 'events.id').where('users_events.user_id', userID);
}

function getNumAthletesForEvent(eventID) {
  return knex('events')
    .where('id', eventID)
    .join('events_athletes', 'events_athletes.event_id', 'events.id')
    .count('events_athletes.event_id')
    .first()
    .then(count => ({ event_id: eventID, count: count.count }));
}

// GET all Users (superuser only)
router.get('/', (req, res, next) => {
  if (req.session.is_admin) {
    knex.select('first_name', 'last_name', 'email')
      .from('users')
      .then((allUsers) => {
        res.json(allUsers);
      }).catch((err) => {
        console.error(err);
        next(err);
      });
  } else {
    res.status(401).send({ error: 'Not authorized!' });
  }
});

// GET a user's account info
router.get('/:id', (req, res, next) => {
  const userID = Number.parseInt(req.params.id, 10);

  if (_.isValidID(userID) && req.session.id === userID) {
    knex.select('first_name', 'last_name', 'timezone', 'email', 'paypal_email')
      .from('users')
      .where('id', userID)
      .first()
      .then((userData) => {
        res.json(userData);
      })
      .catch((err) => {
        console.error(err);
        next(err);
      });
  } else {
    res.status(401).send({ error: 'Not authorized!' });
  }
});

// Edit user profile
router.put('/:id/edit', ev(validations.put), (req, res, next) => {
  const userID = Number.parseInt(req.params.id, 10);
  if (_.isValidID(userID) && req.session.id === userID) {
    // Add code to change password
    knex('users')
      .where('id', userID)
      .returning(['first_name', 'last_name', 'timezone', 'paypal_email'])
      .update({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        timezone: req.body.timezone,
        paypal_email: req.body.paypal_email,
      })
      .then((updatedData) => {
        res.json(updatedData[0]);
      })
      .catch((err) => {
        console.error(err);
        next(err);
      });
  } else {
    res.status(401).send({ error: 'Not authorized!' });
  }
});

// New User Registration
router.post('/new', ev(validations.reg_post), (req, res, next) => {
  bcrypt.hash(req.body.password, saltRounds)
    .then(digest => knex('users')
      .insert({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        hashed_password: digest,
        timezone: req.body.timezone,
        paypal_email: req.body.paypal_email,
      })
      .returning(['id', 'is_admin']))
    .then((user) => {
      console.log(user);
      req.session.id = user[0].id;
      req.session.is_admin = user[0].is_admin;
      res.status(200).send({ id: req.session.id, is_admin: req.session.is_admin });
    })
    .catch((err) => {
      console.error(err);
      next(err);
    });
});

// Delete user (admin only)
router.delete('/:id', (req, res, next) => {
  const userID = Number.parseInt(req.params.id, 10);
  if (!_.isValidID(userID)) {
    res.status(400).send({ error: 'Bad request!' });
  }
  if (req.session.is_admin) {
    Promise.all([
      knex('users').where('id', userID).del(),
      getEvents(userID).del(),
    ])
      .then(() => {
        res.sendStatus(200);
      })
      .catch((err) => {
        console.error(err);
        next(err);
      });
  } else {
    res.status(401).send({ error: 'Not authorized! ' });
  }
});


// User login
router.post('/login', ev(validations.login_post), (req, res, next) => {
  knex('users')
    .where('email', req.body.email)
    .first()
    .then((user) => {
      const userID = user.id;
      const storedPassword = user.hashed_password;
      bcrypt.compare(req.body.password, storedPassword, (err, result) => {
        if (result) {
          req.session.id = userID;
          req.session.is_admin = user.is_admin;
          res.status(200).send({ id: userID, is_admin: user.is_admin });
        } else {
          res.status(401).send({ error: 'Wrong email or password!' });
        }
      });
    })
    .catch((err) => {
      console.error(err);
      res.status(401).send({ error: 'Wrong email or password!' });
    });
});

router.put('/logout', (req, res, next) => {
  req.session = null;
  res.status(200).send({ loggedIn: false });
});

// GET all user's events
router.get('/:id/events/', (req, res, next) => {
  const userID = Number.parseInt(req.params.id, 10);
  if (_.isValidID(userID) && req.session.id === userID) {
    getEvents(userID).then((events) => {
      const promises = [];
      events.forEach((event) => {
        promises.push(getNumAthletesForEvent(event.id));
      });

      Promise.all(promises).then((counts) => {
        const eventsIndexed = events.reduce((a, z) => {
          a[z.id] = z;
          return a;
        }, {});

        counts.forEach((count) => {
          eventsIndexed[count.event_id].numAthletes = count.count;
        });

        const result = [];
        Object.keys(eventsIndexed).forEach((key) => {
          result.push(eventsIndexed[key]);
        });

        res.json(result);
      });


      // res.json(events);
    }).catch((err) => {
      console.error(err);
      next(err);
    });
  } else {
    res.status(401).send({ error: 'Not authorized!' });
  }
});


module.exports = router;
