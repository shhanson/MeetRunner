exports.up = knex =>
  knex.schema.table('athletes', (table) => {
    table.string('club').notNullable().defaultTo('unattached');
  });

exports.down = knex =>
  knex.schema.table('athletes', (table) => {
    table.dropColumn('club');
  });
