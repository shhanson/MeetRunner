const bodyParser = require('body-parser');
const ev = require('express-validation');
const express = require('express');

const _ = require('../tools/tools');
const knex = require('../knex');
const validations = require('../validations/athletes');

const router = express.Router();

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
  extended: false,
}));

// GET all athletes registered for an event
router.get('/:id/athletes', (req, res, next) => {
  // Check logged in
});

// POST a new athlete to the event
router.post('/:id/athletes/new', ev(validations.post), (req, res, next) => {
  // Check logged in
});

// GET the requested athlete from an event
router.get('/:event_id/athletes/:athlete_id', (req, res, next) => {
  // Check logged in
});

// PUT request for specified athlete within an event
router.put('/:event_id/athletes/:athlete_id/edit', ev(validations.put), (req, res, next) => {
  // Check logged in
});

// DELETE an athlete from an event
router.delete('/:event_id/athletes/:athlete_id', (req, res, next) => {
  // Check logged in

});

module.exports = router;
