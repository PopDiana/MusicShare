'use strict';
module.exports = (sequelize, DataTypes) => {
  const Genre = sequelize.define('Genre', {
    name: {
      type: DataTypes.STRING
    }
  }, {});
  Genre.associate = function (models) {
    Genre.hasMany(models.Song, { foreignKey: 'genreId', onDelete: 'CASCADE', hooks: true });
  };
  return Genre;
};