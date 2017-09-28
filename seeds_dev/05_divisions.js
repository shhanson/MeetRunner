const testDivisions = require('../tools/testData').divisions;

exports.seed = knex =>
  knex('divisions').del()
    .then(() =>
      knex('divisions')
        .insert(testDivisions)
        .then(() => {
          knex.raw("select setval('divisions_id_seq', (select max(id) from divisions))").catch((err) => {
            console.error(err);
          });
        }));
