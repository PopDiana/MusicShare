'use strict';
module.exports = (sequelize, DataTypes) => {
  const Song = sequelize.define('Song', {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    albumId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    genreId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: false
    },
    songUrl: {
      type: DataTypes.STRING,
      allowNull: false
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    likes: {
      type: DataTypes.INTEGER,
    },
    plays: {
      type: DataTypes.INTEGER,
    },
    comments: {
      type: DataTypes.INTEGER,
    },
    available: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
  }, {});
  Song.associate = function(models) {
    Song.hasMany(models.Comment, {foreignKey: 'songId', onDelete: 'CASCADE', hooks: true});
    Song.hasMany(models.Like, {foreignKey: 'songId', onDelete: 'CASCADE', hooks: true});
    Song.hasMany(models.PlaylistSong, {foreignKey: 'songId', onDelete: 'CASCADE', hooks: true});
    Song.hasMany(models.History, {foreignKey: 'songId', onDelete: 'CASCADE', hooks: true});
    Song.belongsTo(models.User, {foreignKey: 'userId'});
    Song.belongsTo(models.Album, {foreignKey: 'albumId'});
    Song.belongsTo(models.Genre, {foreignKey: 'genreId'});
  };
  return Song;
};
