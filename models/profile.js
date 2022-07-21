'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Profile extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Profile.belongsTo(models.User, {
        foreignKey: 'UserId'
      })
    }

    nameConverter() {
      return `${this.firstName} ${this.lastName}`
    }

    get privateAccount() {
      if (this.isPrivacy === false) {
        return 'Public Account'
      } else if (this.isPrivacy === true){
        return 'Private Account'
      }
      
    }

  }
  Profile.init({
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'first name cant be null'
        },
        notEmpty: {
          msg: 'first name cant be empty'
        }
      }
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'last name cant be null'
        },
        notEmpty: {
          msg: 'last name cant be empty'
        }
      }
    },
    profilePicture: DataTypes.STRING,
    bio: DataTypes.TEXT,
    phone: DataTypes.STRING,
    isPrivacy: DataTypes.BOOLEAN,
    UserId: DataTypes.INTEGER
  }, {
    hooks: {
      beforeCreate(profile) {
        profile.isPrivacy = false
        profile.profilePicture = "/images/user.png"
      }
    },
    sequelize,
    modelName: 'Profile',
  });
  return Profile;
};