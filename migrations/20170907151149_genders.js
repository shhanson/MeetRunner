exports.up = knex =>
  knex.schema.createTable('genders', (table) => {
    table.increments('id');
    table.string('gender').notNullable();
    table.timestamps(true, true);
  });

exports.down = knex =>
  knex.schema.dropTable('genders');
