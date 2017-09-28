const testData = require('../tools/testData').divisions_categories;

exports.seed = knex =>
  knex('divisions_categories').del()
    .then(() =>
      knex('divisions_categories')
        .insert(testData),
    );
