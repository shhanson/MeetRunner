const testAttempts = require('../tools/testData').attempts;

exports.seed = knex =>
  knex('attempts').del()
    .then(() =>
      knex('attempts')
        .insert(testAttempts)
        .then(() => {
          knex.raw("select setval('attempts_id_seq', (select max(id) from attempts))").catch((err) => {
            console.error(err);
          });
        }));
