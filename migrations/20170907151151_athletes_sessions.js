exports.up = knex =>
  knex.schema.createTable('athletes_sessions', (table) => {
    table.integer('athlete_id').references('id').inTable('athletes').notNullable();
    table.integer('session_id').references('id').inTable('sessions').notNullable();
    table.timestamps(true, true);
  });

exports.down = knex =>
  knex.schema.dropTable('athletes_sessions');
