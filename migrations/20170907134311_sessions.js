exports.up = knex =>
  knex.schema.createTable('sessions', (table) => {
    table.increments('id');
    table.integer('event_id').references('id').inTable('events').notNullable()
      .onDelete('CASCADE');
    table.timestamp('date').notNullable();
    table.timestamp('weigh_time');
    table.timestamp('start_time');
    table.string('description');
    table.timestamps(true, true);
  });

exports.down = knex =>
  knex.schema.dropTable('sessions');
