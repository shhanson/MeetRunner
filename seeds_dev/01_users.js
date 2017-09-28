const bcrypt = require('bcrypt');
const testUsers = require('../tools/testData').users;

const saltRounds = 11;

function insertUser(knex, userData) {
  return knex('users').insert({
    id: userData.id,
    first_name: userData.first_name,
    last_name: userData.last_name,
    hashed_password: bcrypt.hashSync(userData.password, saltRounds),
    email: userData.email,
    is_admin: userData.is_admin,
  });
}

exports.seed = function (knex, Promise) {
  const userPromises = [];
  testUsers.forEach((user) => {
    userPromises.push(insertUser(knex, user));
  });
  return Promise.all(userPromises).then(() => {
    knex.raw("select setval('users_id_seq', (select max(id) from users))").catch((err) => {
      console.error(err);
    });
  });
};
