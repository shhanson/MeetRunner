exports.up = knex =>
  knex.schema.createTable('users', (table) => {
    table.increments('id');
    table.string('first_name').notNullable();
    table.string('last_name').notNullable();
    table.string('email').notNullable().unique();
    table.string('hashed_password').notNullable();
  });

exports.down = knex =>
  knex.schema.dropTable('users');
