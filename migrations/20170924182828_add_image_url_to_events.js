exports.up = knex =>
  knex.schema.table('events', (table) => {
    table.string('image_url').defaultTo('/images/hpg_platform.jpg');
  });

exports.down = knex =>
  knex.schema.table('events', (table) => {
    table.dropColumn('image_url');
  });
