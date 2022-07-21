'use strict';
const fs = require('fs')
const bcrypt= require('bcrypt');

module.exports = {
  up (queryInterface, Sequelize) {
    const users = JSON.parse(fs.readFileSync('./data/user.json', 'utf-8'))
    let salt= bcrypt.genSaltSync(10)
    
    users.forEach(user => {
      user.createdAt = new Date()
      user.updatedAt = new Date()
      let hash= bcrypt.hashSync(user.password,salt)
      user.password= hash
      delete user.id
    });
    
    return queryInterface.bulkInsert('Users', users)
  },

  down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Users')
  }
};
