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
  knex('categories')
    .then((categories) => {
      res.json(categories);
    })
    .catch((err) => {
      console.error(err);
      next(err);
    });
});

router.get('/:category_id', (req, res, next) => {
  const categoryID = Number.parseInt(req.params.category_id, 10);
  if (!_.isValidID(categoryID)) {
    res.status(400).send({ error: 'Bad request! ' });
  }

  knex('categories')
    .where('id', categoryID)
    .first()
    .then((category) => {
      res.json(category);
    })
    .catch((err) => {
      console.error(err);
      next(err);
    });
});


module.exports = router;
