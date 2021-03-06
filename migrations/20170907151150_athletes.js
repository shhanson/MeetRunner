exports.up = knex =>
  knex.schema.createTable('athletes', (table) => {
    table.increments('id');
    table.string('email');
    table.string('first_name').notNullable();
    table.string('last_name').notNullable();
    table.string('usaw_id').notNullable();
    table.integer('year_of_birth').notNullable();
    table.integer('gender_id').references('id').inTable('genders').notNullable();
    table.integer('lot_num').defaultTo(0);
    table.integer('bodyweight_grams').defaultTo(0);
    table.integer('division_id').references('id').inTable('divisions');
    table.integer('category_id').references('id').inTable('categories');
    table.integer('entry_total').notNullable();
    table.integer('total').defaultTo(0);
  });

exports.down = knex =>
  knex.schema.dropTable('athletes');
