'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserTable extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  UserTable.init({
    UserName: {
      type:DataTypes.STRING,
      allowNull:false
    },
    UserID: {
      type:DataTypes.STRING,
      allowNull:false
    },
    UserPW:  {
      type:DataTypes.STRING,
      allowNull:false
    },
    UserPNum:  {
      type:DataTypes.STRING,
      allowNull:false
    },
    UserEmail:  {
      type:DataTypes.STRING,
      allowNull:false
    }
  }, {
    sequelize,
    modelName: 'UserTable',
  });
  return UserTable;
};