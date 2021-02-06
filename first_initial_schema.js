// run the following command to install:
// npm install objection knex sqlite3

const { Model } = require('objection');
const Knex = require('knex');

// Initialize knex.
const knex = Knex({
  client: 'mysql',
  connection: {
    host: 'localhost',
    port: 3319,
    user: 'root',
    password: '1234abcd',
    database: 'objection_orm',
  }
});

// Give the knex instance to objection.
Model.knex(knex);

// Person model.
class Person extends Model {
  static get tableName() {
    return 'persons';
  }

}

async function createSchema() {
  if (await knex.schema.hasTable('persons')) {
    return;
  }

  // Create database schema. You should use knex migration files
  // to do this. We create it here for simplicity.
  await knex.schema
  .createTable('persons', function (table) {
    table.increments('id').primary();
    table.string('firstName');
    table.string('lastName');
    table.string('urlProfilePic');
    table.string('email');
    table.string('hashPassword');
    table.string('token');

  })
};

async function main() {
 
  // Fetch all people named Sylvester and sort them by id.
  // Load `children` relation eagerly.
  const sylvesters = await Person.query()
  console.log('sylvesters:', sylvesters);
}

createSchema()
  .then(() => main())
  .then(() => knex.destroy())
  .catch(err => {
    console.error(err);
    return knex.destroy();
  });