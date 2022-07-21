'use strict';
const fs = require('fs')

module.exports = {
  up (queryInterface, Sequelize) {
    const tags = JSON.parse(fs.readFileSync('./data/tag.json', 'utf-8')).map(tag => {
      tag.createdAt = tag.updatedAt = new Date ()
      return tag
    })

    return queryInterface.bulkInsert('Tags', tags)
  },

  down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Tags')
  }
};
