const bcrypt = require('bcrypt');
const testUsers = require('../tools/testData').users;

const saltRounds = 11;

exports.seed = knex =>
  knex('users').del()
    .then(() =>
      bcrypt.hash(testUsers[0].password, saltRounds).then(digest =>
        knex('users').insert({
          id: testUsers[0].id,
          first_name: testUsers[0].first_name,
          last_name: testUsers[0].last_name,
          email: testUsers[0].email,
          hashed_password: digest,
        }).then(() =>
          knex.raw("SELECT setval('users_id_seq', (SELECT MAX(id) FROM users))"))));


// function insertUser(knex, userData) {
//   bcrypt.hash(userData.password, saltRounds).then(digest => knex('users').insert({
//     first_name: userData.first_name,
//     last_name: userData.last_name,
//     email: userData.email,
//     hashed_password: digest,
//   }).catch((err) => {
//     console.error(err);
//   }));
// }
//
// exports.seed = function (knex, Promise) {
//   const userPromises = [];
//   testUsers.forEach((user) => {
//     userPromises.push(insertUser(knex, user));
//   });
//
//   return Promise.all(userPromises);
// };
