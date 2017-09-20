exports.up = knex =>
  knex.schema.table('events', (table) => {
    table.boolean('registration_open').notNullable().defaultTo(true);
  });

exports.down = knex =>
  knex.schema.table('events', (table) => {
    table.dropColumn('registration_open');
  });
