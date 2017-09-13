exports.up = knex =>
  knex.schema.createTable('divisions_categories', (table) => {
    table.integer('division_id').references('id').inTable('divisions').notNullable()
      .onDelete('CASCADE');
    table.integer('category_id').references('id').inTable('categories').notNullable()
      .onDelete('CASCADE');
    table.timestamps(true, true);
  });

exports.down = knex =>
  knex.schema.dropTable('divisions_categories');
