// For associating athletes with the events they've registered for
exports.up = knex =>
  knex.schema.createTable('events_athletes', (table) => {
    table.integer('event_id').references('id').inTable('events').notNullable();
    table.integer('athlete_id').references('id').inTable('athletes').notNullable();
    table.timestamps(true, true);
  });

exports.down = knex =>
  knex.schema.dropTable('events_athletes');
