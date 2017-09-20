exports.up = knex =>
  knex.schema.table('users', (table) => {
    table.string('paypal_email');
  });

exports.down = knex =>
  knex.schema.table('users', (table) => {
    table.dropColumn('paypal_email');
  });
