const testCategories = require('../tools/testData').categories;

exports.seed = knex =>
  knex('categories').del()
    .then(() =>
      knex('categories')
        .insert(testCategories)
        .then(() => {
          knex.raw("select setval('categories_id_seq', (select max(id) from categories))").catch((err) => {
            console.error(err);
          });
        }));
