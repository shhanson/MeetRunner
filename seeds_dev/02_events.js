const testEvents = require('../tools/testData').events;
const testUsersEvents = require('../tools/testData').users_events;

exports.seed = knex =>
  knex('events').del()
    .then(() =>
      knex('events')
        .insert(testEvents)
        .then(() =>
          knex('users_events')
            .insert(testUsersEvents)
            .then(() => {
              knex.raw("select setval('events_id_seq', (select max(id) from events))").catch((err) => {
                console.error(err);
              });
            })));
