'use strict';
const fs = require('fs')

module.exports = {
  up (queryInterface, Sequelize) {
    const profiles = JSON.parse(fs.readFileSync('./data/profile.json', 'utf-8'))
    profiles.forEach(profile => {
      profile.createdAt = new Date()
      profile.updatedAt = new Date()
    })

    return queryInterface.bulkInsert('Profiles', profiles)
  },

  down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Profiles')
  }
};
