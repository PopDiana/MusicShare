'use strict';
module.exports = (sequelize, DataTypes) => {
  const History = sequelize.define('History', {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    playlistId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    songId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    itemType: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }, {});
  History.associate = function(models) {
    History.belongsTo(models.User, {foreignKey: 'userId'});
    History.belongsTo(models.Playlist, {foreignKey: 'playlistId'});
    History.belongsTo(models.Song, {foreignKey: 'songId'});
  };
  return History;
};