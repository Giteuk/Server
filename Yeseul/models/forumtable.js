'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ForumTable extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  ForumTable.init({
    Title: {
      type : DataTypes.STRING,
      allowNull : false
    },
    UserName: {
      type : DataTypes.STRING,
      allowNull : false
    },
    Content: {
      type : DataTypes.STRING
    }
  }, {
    sequelize,
    modelName: 'ForumTable',
  });
  return ForumTable;
};