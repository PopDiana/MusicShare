'use strict';
const {Validator} = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [2, 20],
        isNotEmail(value) {
          if (Validator.isEmail(value)) {
            throw new Error('Cannot be an email.');
          }
        },
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [5, 50]
      },
    },
    profileImageUrl: {
      type: DataTypes.STRING,
      allowNull: false
    },
    bio: {
      type: DataTypes.STRING,
      allowNull: false
    },
    hashedPassword: {
      type: DataTypes.STRING.BINARY,
      allowNull: false,
      validate: {
        len: [60, 60]
      },
    },
    followers: {
      type: DataTypes.INTEGER,
    },
    verified: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
  },
  {
    defaultScope: {
      attributes: {
        exclude: ['hashedPassword', 'email', 'createdAt', 'updatedAt'],
      },
    },
    scopes: {
      currentUser: {
        attributes: {
          exclude: ['hashedPassword']
        },
      },
      loginUser: {
        attributes: {},
      },
    },
  });
  User.prototype.toSafeObject = function() {
    const {id, username, profileImageUrl, bio, email} = this;
    return {id, username, profileImageUrl, bio, email};
  }

  User.prototype.validatePassword = function(password) {
    return bcrypt.compareSync(password, this.hashedPassword.toString());
  };

  User.getCurrentUserById = async function(id) {
    return await User.scope('currentUser').findByPk(id);
  };

  User.login = async function({credential, password}) {
    const {Op} = require('sequelize');
    const user = await User.scope('loginUser').findOne({
      where: {
        [Op.or]: {
          username: credential,
          email: credential,
        },
      },
    });

    if (user && user.validatePassword(password)) {
      return await User.scope('currentUser').findByPk(user.id);
    }
  };

  User.register = async function ({username, email, profileImageUrl,
    bio, password}) {
    const hashedPassword = bcrypt.hashSync(password);
    const user = await User.create({
      username,
      email,
      profileImageUrl,
      bio,
      hashedPassword,
    });

    return await User.scope('currentUser').findByPk(user.id);
  };

  User.associate = function(models) {
    User.hasMany(models.Album, {foreignKey: 'userId', onDelete: 'CASCADE', hooks: true});
    User.hasMany(models.Song, {foreignKey: 'userId', onDelete: 'CASCADE', hooks: true});
    User.hasMany(models.Comment, {foreignKey: 'userId', onDelete: 'CASCADE', hooks: true});
    User.hasMany(models.Like, {foreignKey: 'userId', onDelete: 'CASCADE', hooks: true});
    User.hasMany(models.Follow, {foreignKey: 'userId', onDelete: 'CASCADE', hooks: true});
    User.hasMany(models.Playlist, {foreignKey: 'userId', onDelete: 'CASCADE', hooks: true});
    User.hasMany(models.History, {foreignKey: 'userId', onDelete: 'CASCADE', hooks: true});
    //User.hasMany(models.Follow, {foreignKey: 'followerId', onDelete: 'CASCADE', hooks: true});
  };
  return User;
};