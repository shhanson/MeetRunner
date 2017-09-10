const testEvents = require('../tools/testData').events;

exports.seed = knex =>
  knex('events').del()
    .then(() =>
      knex('events')
        .insert(testEvents)
        .then(() =>
          knex('users_events')
            .insert([
              {
                user_id: 1,
                event_id: 1,
              },
              {
                user_id: 1,
                event_id: 2,
              },
            ])
            .then(() =>
              knex.raw("SELECT setval('users_id_seq', (SELECT MAX(id) FROM users))"))));
