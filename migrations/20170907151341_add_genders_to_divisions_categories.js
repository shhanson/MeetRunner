exports.up = knex =>
  knex.schema.table('divisions_categories', (table) => {
    table.integer('gender_id', 16).references('id').inTable('genders').notNullable()
      .onDelete('CASCADE');
  });

exports.down = knex =>
  knex.schema.table('divisions_categories', (table) => {
    table.dropColumn('gender_id');
  });
