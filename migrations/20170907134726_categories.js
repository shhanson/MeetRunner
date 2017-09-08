exports.up = knex =>
  knex.schema.createTable('categories', (table) => {
    table.increments('id');
    table.string('category').notNullable();
    table.timestamps(true, true);
  });

exports.down = knex =>
  knex.schema.dropTable('categories');
