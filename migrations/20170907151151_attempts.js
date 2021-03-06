exports.up = knex =>
  knex.schema.createTable('attempts', (table) => {
    table.increments('id');
    table.string('type').notNullable();
    table.integer('athlete_id').references('id').inTable('athletes').notNullable()
      .onDelete('CASCADE');
    table.integer('attempt_num').notNullable();
    table.integer('weight').notNullable();
    table.boolean('attempted').notNullable().defaultTo(false);
    table.boolean('success').notNullable().defaultTo(false);
    table.timestamps(true, true);
  });

exports.down = knex =>
  knex.schema.dropTable('attempts');
