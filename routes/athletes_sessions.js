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
});

// DELETE an athlete from a session
router.delete('/:event_id/sessions/:session_id/athletes/:athlete_id/remove', (req, res, next) => {
  // Check logged in

});

// Add an athlete to the session
router.post('/:event_id/sessions/:session_id/athletes/:athlete_id/add', (req, res, next) => {
  // Check logged in
});

// EDIT an athlete's session
router.put('/:event_id/sessions/:session_id/athletes/:athlete_id/edit', (req, res, next) => {
  // Check logged in
});

module.exports = router;
