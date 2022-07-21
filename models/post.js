'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Post.belongsTo(models.User, {
        foreignKey: 'UserId'
      })
      
      Post.hasMany(models.PostTag)

      Post.belongsToMany(models.Tag, {
        through: models.PostTag
      })
    }
  }
  Post.init({
    caption: DataTypes.STRING,
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg : 'image cant be null'
        },
        notEmpty: {
          msg: 'image cant be empty'
        }
      }
    },
    UserId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Post',
  });
  return Post;
};