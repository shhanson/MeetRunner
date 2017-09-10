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
router.get('/', (req, res, next) => {
  if (req.session.is_admin) {
    knex('users').then((allUsers) => {
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
    res.status(401).send({ error: 'Not authorized!' });
  }
});

// New User Registration
router.post('/', ev(validations.reg_post), (req, res, next) => {
  if (!req.session.id) {
    bcrypt.hash(req.body.password, saltRounds).then((digest) => {
      knex('users')
        .insert({
          first_name: req.body.first_name,
          last_name: req.body.last_name,
          email: req.body.email,
          hashed_password: digest,
        })
        .then(() => {
          res.redirect('/login');
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
  } else {
    // If the user is already registered and logged in, redirect to user page
    res.redirect(`/${req.session.id}`);
  }
});

// Delete user (admin only)
router.delete('/:id', (req, res, next) => {
  if (req.session.is_admin) {
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
      res.status(400).send({ error: 'Bad request!' });
    }
  } else {
    res.status(401).send({ error: 'Not authorized! ' });
  }
});


// User login
router.post('/login', ev(validations.login_post), (req, res, next) => {
  if (!req.session.id) {
    knex('users')
      .where('email', req.body.email)
      .first()
      .then((user) => {
        const userID = user.id;
        const storedPassword = user.hashed_password;

        bcrypt.compare(req.body.password, storedPassword)
          .then((matched) => {
            if (matched) {
              req.session.id = userID;
              req.session.is_admin = user.is_admin;
              res.redirect(`/${userID}`);
            } else {
              res.status(401).send({ error: 'Wrong email or password!' });
            }
          })
          .catch((err) => {
            console.error(err);
            res.status(500).send({ error: 'Server errror!' });
          });
      })
      .catch((err) => {
        console.error(err);
        res.status(401).send({ error: 'Wrong email or password!' });
      });
  } else {
    // If the user is already logged in, redirect to user page
    res.redirect(`/${req.session.id}`);
  }
});

router.delete('/logout', (req, res, next) => {
  req.session = null;
  res.redirect('/');
});

// GET all user's events
router.get('/:id/events/', (req, res, next) => {
  const userID = Number.parseInt(req.params.id, 10);
  if (_.isValidID(userID) && req.session.id === userID) {
    getEvents(userID).then((events) => {
      res.json(events);
    }).catch((err) => {
      console.error(err);
      next(err);
    });
  } else {
    res.status(401).send({ error: 'Not authorized!' });
  }
});

// Edit a single event of a user
router.put('/:user_id/events/:event_id', ev(validations.event_put), (req, res, next) => {
  const userID = Number.parseInt(req.params.user_id, 10);
  const eventID = Number.parseInt(req.params.event_id, 10);

  if (_.isValidID(userID) && _.isValidID(eventID) && req.session.id === userID) {
    // First check if the user owns the event
    knex('users_events')
      .where('event_id', eventID)
      .then((data) => {
        if (data.user_id === userID) {
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
            }).then(() => {
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
        next();
      });
  } else {
    res.status(401).send({ error: 'Not authorized!' });
  }
});


module.exports = router;
