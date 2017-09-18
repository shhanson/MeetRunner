const bodyParser = require('body-parser');
const express = require('express');

const _ = require('../tools/tools');
const knex = require('../knex');

const router = express.Router();

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
  extended: false,
}));


router.get('/', (req, res, next) => {
  knex('divisions')
    .then((divisions) => {
      res.json(divisions);
    }).catch((err) => {
      console.error(err);
      next(err);
    });
});

router.get('/:division_id', (req, res, next) => {
  const divisionID = Number.parseInt(req.params.division_id, 10);
  if (!_.isValidID(divisionID)) {
    res.status(400).send({ error: 'Bad request!' });
  }

  knex('divisions')
    .where('id', divisionID)
    .first()
    .then((division) => {
      res.json(division);
    }).catch((err) => {
      console.error(err);
      next(err);
    });
});

router.get('/:division_id/categories/male', (req, res, next) => {
  const divisionID = Number.parseInt(req.params.division_id, 10);
  const genderID = 2; // "m"
  if (!_.isValidID(divisionID)) {
    res.status(400).send({ error: 'Bad request!' });
  }

  knex.select('divisions_categories.*')
    .from('divisions_categories')
    .join('categories', 'categories.id', 'divisions_categories.category_id')
    .where({
      gender_id: genderID,
      division_id: divisionID,
    })
    .then((categories) => {
      console.log(categories);
      res.json(categories);
    })
    .catch((err) => {
      console.error(err);
      next(err);
    });
});

router.get('/:division_id/categories/female', (req, res, next) => {
  const divisionID = Number.parseInt(req.params.division_id, 10);
  const genderID = 1; // "m"
  if (!_.isValidID(divisionID)) {
    res.status(400).send({ error: 'Bad request!' });
  }

  knex.select('divisions_categories.*')
    .from('divisions_categories')
    .join('categories', 'categories.id', 'divisions_categories.category_id')
    .where({
      gender_id: genderID,
      division_id: divisionID,
    })
    .then((categories) => {
      console.log(categories);
      res.json(categories);
    })
    .catch((err) => {
      console.error(err);
      next(err);
    });
});


module.exports = router;
