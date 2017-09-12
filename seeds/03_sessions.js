const testSessions = require('../tools/testData').sessions;

exports.seed = knex =>
  knex('sessions').del()
    .then(() =>
      knex('sessions')
        .insert(testSessions)
        .then(() => {
          knex.raw("select setval('sessions_id_seq', (select max(id) from sessions))").catch((err) => {
            console.error(err);
          });
        }));
