exports.up = knex =>
  knex.schema.table('events', (table) => {
    table.string('image_url').defaultTo('/images/karhu_platform-min.jpg');
  });

exports.down = knex =>
  knex.schema.table('events', (table) => {
    table.dropColumn('image_url');
  });
