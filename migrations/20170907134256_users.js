exports.up = knex =>
  knex.schema.createTable('users', (table) => {
    table.increments('id');
    table.string('first_name').notNullable();
    table.string('last_name').notNullable();
    table.string('timezone').notNullable().defaultTo('-06');
    table.string('email').notNullable().unique();
    table.string('hashed_password').notNullable();
    table.boolean('is_admin').notNullable().defaultTo(false);
  });

exports.down = knex =>
  knex.schema.dropTable('users');
