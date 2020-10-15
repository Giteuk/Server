'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('UserTables', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      UserName: {
        type: Sequelize.STRING,
        allowNull : false
      },
      UserID: {
        type: Sequelize.STRING,
        allowNull : false
      },
      UserPW: {
        type: Sequelize.STRING,
        allowNull : false
      },
      UserPNum: {
        type: Sequelize.STRING,
        allowNull : false
      },
      UserEmail: {
        type: Sequelize.STRING,
        allowNull : false
      },
      createdAt:{
        type: Sequelize.STRING,
        allowNull : false
      },
      updatedAt: {
        type: Sequelize.STRING,
        allowNull : false
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('UserTables');
  }
};