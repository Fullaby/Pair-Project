'use strict';
const {
  Model
} = require('sequelize');
const bcrypt= require('bcrypt');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.hasOne(models.Profile)
      User.hasMany(models.Post)
    }

  }
  User.init({
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'username cant be null'
        },
        notEmpty: {
          msg: 'username cant be empty'
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'email cant be null'
        },
        notEmpty: {
          msg: 'email cant be empty'
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'password cant be null'
        },
        notEmpty: {
          msg: 'password cant be empty'
        },
        len: {
          args: [8, Infinity],
          msg: 'password should be minimum of 8 characters'
        }
      }
    },
    role: DataTypes.STRING
  },{ hooks:{
    beforeCreate:(instance,options)=>{
      let salt= bcrypt.genSaltSync(10)
      let hash= bcrypt.hashSync(instance.password,salt)
      instance.password= hash
      instance.role= 'User'
    }
  },
    sequelize,
    modelName: 'User',
  });
  return User;
};