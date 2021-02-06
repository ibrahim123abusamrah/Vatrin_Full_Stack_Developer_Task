const { Model } = require('objection');

class Person extends Model {
  static get tableName() {
    return 'persons';
  }
  static get jsonSchema() {
    return {
      type: 'object',
      required: ['firstName', 'lastName','email','hashPassword'],
      properties: {
        id: { type: 'integer' },
        firstName: { type: 'string', minLength: 1, maxLength: 255 },
        lastName: { type: 'string', minLength: 1, maxLength: 255 },
        urlProfilePic: { type: 'string', minLength: 1, maxLength: 255 },
        email: { type: 'string', minLength: 1, maxLength: 255 },
        hashPassword: { type: 'string', minLength: 1, maxLength: 255 },
        token: { type: 'string', minLength: 1, maxLength: 255 },

      }
    };
  }

}
module.exports = Person;