const testGenders = require('../tools/testData').genders;

exports.seed = knex =>
  knex('genders').del()
    .then(() =>
      knex('genders')
        .insert(testGenders)
        .then(() => {
          knex.raw("select setval('genders_id_seq', (select max(id) from genders))").catch((err) => {
            console.error(err);
          });
        }));
