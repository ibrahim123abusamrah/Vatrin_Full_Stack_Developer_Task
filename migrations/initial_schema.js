exports.up = function (knex) {
  return knex.schema
    .createTable('Person', function (table) {
      table.increments('id').primary();
      table.string('firstName');
      table.string('lastName');
      table.string('urlProfilePic');
      table.string('email');
      table.string('username');
      table.string('hashPassword');
      table.string('token');
    })
};

exports.down = function (knex) {
  return knex.schema
    .dropTableIfExists('Person');
};
