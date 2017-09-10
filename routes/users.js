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
  knex('users_events').join('events', 'event_id', 'event.id').where('users_events.user_id', userID).orderBy('events.id', 'desc');
}

// GET all Users (superuser only)
router.get('/users', (req, res, next) => {
  // Add check if Admin
  knex('users').then((allUsers) => {
    res.json(allUsers);
  }).catch((err) => {
    console.error(err);
    next(err);
  });
});

// GET a User with a given ID
router.get('/users/:id', (req, res, next) => {
  // Add check for session
  const userID = Number.parseInt(req.params.id, 10);
  if (_.isValidID(userID)) {
    getEvents(userID).then((events) => {
      res.json(events);
    }).catch((err) => {
      console.error(err);
      next(err);
    });
  } else {
    next();
  }
});

// GET a user's account info
router.get('/users/:id/edit', (req, res, next) => {
  const userID = Number.parseInt(req.params.id, 10);
  // Add Check for Session
  if (_.isValidID(userID)) {
    knex.select('first_name', 'last_name')
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
    next();
  }
});

// New User Registration
router.post('/users', ev(validations.reg_post), (req, res, next) => {
  bcrypt.hash(req.body.password, saltRounds).then((digest) => {
    knex('users')
      .insert({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        hashed_password: digest,
      })
      .then(() => {
        res.sendStatus(200);
      })
      .catch((err) => {
        console.error(err);
        res.status(400).send({ error: 'That email address is already registered!' });
      });
  })
    .catch((err) => {
      console.error(err);
      next(err);
    });
});

router.put('/users/:id/edit', ev(validations.put), (req, res, next) => {
  const userID = Number.parseInt(req.params.id, 10);
  // Add check for session
  if (_.isValidID(userID)) {
    // Add code to change password
    knex('users')
      .where('id', userID)
      .update({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
      }).then(() => {
        res.sendStatus(200);
      })
      .catch((err) => {
        console.error(err);
        next(err);
      });
  } else {
    next();
  }
});

router.delete('/user/:id', (req, res, next) => {
  // Check if user is Admin
  const userID = Number.parseInt(req.params.id, 10);
  if (_.isValidID(userID)) {
    // Delete from join table first
    knex('users_events')
      .where('user_id', userID)
      .del()
      .then(() => {
        knex('users')
          .where('id', userID)
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
    next();
  }
});
