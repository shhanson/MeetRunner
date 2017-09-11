// For associating athletes with the events they've registered for
exports.up = knex =>
  knex.schema.createTable('events_athletes', (table) => {
    table.integer('event_id').references('id').inTable('events').notNullable()
      .onDelete('CASCADE');
    table.integer('athlete_id').references('id').inTable('athletes').notNullable()
      .onDelete('CASCADE');
    table.timestamps(true, true);
  });

exports.down = knex =>
  knex.schema.dropTable('events_athletes');
