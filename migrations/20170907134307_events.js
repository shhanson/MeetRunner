exports.up = knex =>
  knex.schema.createTable('events', (table) => {
    table.increments('id');
    table.string('title', 50).notNullable();
    table.string('organizer', 50).notNullable();
    table.string('sanction_id').notNullable();
    table.timestamp('start_date').notNullable();
    table.timestamp('end_date').notNullable();
    table.string('street_address').notNullable();
    table.string('city').notNullable();
    table.string('state', 2).notNullable();
    table.string('zip_code').notNullable();
    table.string('phone').notNullable();
    table.string('email').notNullable();
    table.string('description').notNullable();
    table.integer('entry_fee_cents').notNullable().defaultTo(0);
    table.timestamps(true, true);
  });

exports.down = knex =>
  knex.schema.dropTable('events');
