'use strict';
const fs = require ('fs')

module.exports = {
  up (queryInterface, Sequelize) {
    const posts = JSON.parse(fs.readFileSync('./data/post.json', 'utf-8')).map(post => {
      post.createdAt = post.updatedAt = new Date()
      return post
    })

    return queryInterface.bulkInsert('Posts', posts)
  },

  down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Posts')
  }
};
