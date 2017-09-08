exports.up = knex =>
  knex.schema.createTable('divisions', (table) => {
    table.increments('id');
    table.string('division').notNullable();
    table.timestamps(true, true);
  });

exports.down = knex =>
  knex.schema.dropTable('divisions');
