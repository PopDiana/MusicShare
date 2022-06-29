'use strict';
module.exports = (sequelize, DataTypes) => {
  const PlaylistSong = sequelize.define('PlaylistSong', {
    playlistId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
    ,
    songId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {});
  PlaylistSong.associate = function (models) {
    PlaylistSong.belongsTo(models.Playlist, {foreignKey: 'playlistId'});
  };
  return PlaylistSong;
};