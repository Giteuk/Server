'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CommentTable extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  CommentTable.init({
    UserName: {
      type : DataTypes.STRING,
      allowNull : false
    },
    Content: {
      type : DataTypes.STRING,
      allowNull : false
    },
    PostNum: {
      type : DataTypes.INTEGER,
      allowNull : false
    },
  }, {
    sequelize,
    modelName: 'CommentTable',
  });
  return CommentTable;
};