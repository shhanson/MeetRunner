const testSessions = require('../tools/testData').sessions;

exports.seed = knex =>
  knex('sessions').del()
    .then(() =>
      knex('sessions')
        .insert(testSessions)
        .then(() => {
          knex.raw("SELECT setval('sessions_id_seq', (SELECT MAX(id) FROM sessions))");
        }));
