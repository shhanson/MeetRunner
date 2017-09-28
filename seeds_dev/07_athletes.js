const testAthletes = require('../tools/testData').athletes;
const testEventsAthletes = require('../tools/testData').events_athletes;
const testAthletesSessions = require('../tools/testData').athletes_sessions;

exports.seed = knex =>
  knex('athletes').del()
    .then(() =>
      knex('athletes')
        .insert(testAthletes)
        .then(() =>
          Promise.all([
            knex('events_athletes').insert(testEventsAthletes),
            knex('athletes_sessions').insert(testAthletesSessions),
          ]),
        )
        .then(() => {
          knex.raw("select setval('athletes_id_seq', (select max(id) from athletes))").catch((err) => {
            console.error(err);
          });
        }));
