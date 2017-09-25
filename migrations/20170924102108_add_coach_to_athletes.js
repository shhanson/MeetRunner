exports.up = knex =>
  knex.schema.table('athletes', (table) => {
    table.string('coach').defaultTo('');
  });

exports.down = knex =>
  knex.schema.table('athletes', (table) => {
    table.dropColumn('coach');
  });
