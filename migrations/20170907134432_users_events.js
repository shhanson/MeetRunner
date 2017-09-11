// For associating users with the events they've created
exports.up = knex =>
  knex.schema.createTable('users_events', (table) => {
    table.integer('user_id').references('id').inTable('users').notNullable()
      .onDelete('CASCADE');
    table.integer('event_id').references('id').inTable('events').notNullable()
      .onDelete('CASCADE');
    table.timestamps(true, true);
  });

exports.down = knex =>
  knex.schema.dropTable('users_events');
