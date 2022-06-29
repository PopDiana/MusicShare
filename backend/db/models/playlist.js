'use strict';
module.exports = (sequelize, DataTypes) => {
  const Playlist = sequelize.define('Playlist', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    imageUrl: {
      type:
        DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true
    },
    isSecret: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    songNumber: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {});
  Playlist.associate = function (models) {
    Playlist.belongsTo(models.User, {foreignKey: 'userId'});
    Playlist.hasMany(models.PlaylistSong, {foreignKey: 'playlistId', onDelete: 'CASCADE', hooks: true});
    Playlist.hasMany(models.History, {foreignKey: 'playlistId', onDelete: 'CASCADE', hooks: true});
  };
  return Playlist;
};