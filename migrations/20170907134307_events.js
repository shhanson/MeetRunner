exports.up = knex =>
  knex.schema.createTable('events', (table) => {
    table.increments('id');
    table.string('title').notNullable();
    table.string('organizer').notNullable();
    table.string('sanction_id').notNullable();
    table.date('start_date').notNullable();
    table.date('end_date').notNullable();
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
