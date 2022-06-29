'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
      return queryInterface.bulkInsert('Genres', [
        {
          name: "Hip hop",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Alternative",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Classical",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Rock",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Pop",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Jazz",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "EDM",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Country",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "R&B",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Other",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ], {});
  },

  down: (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete('Genres', null, {});
  }
};
