exports.up = knex =>
  knex.schema.createTable('divisions_categories', (table) => {
    table.integer('divison_id').references('id').inTable('divisions').notNullable();
    table.integer('category_id').references('id').inTable('categories').notNullable();
    table.timestamps(true, true);
  });

exports.down = knex =>
  knex.schema.dropTable('divisions_categories');
