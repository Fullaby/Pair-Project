'use strict';
const fs = require ('fs')

module.exports = {
  up (queryInterface, Sequelize) {
    const postTags = JSON.parse(fs.readFileSync('./data/posttag.json', 'utf-8')).map(posttag => {
      posttag.createdAt = posttag.updatedAt = new Date()
      return posttag
    })
    return queryInterface.bulkInsert('PostTags', postTags)
  },

  down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('PostTags')
  }
};
