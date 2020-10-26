'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class FarmTable extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  FarmTable.init({
    FarmName: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: this.id+"번 밭"
    }
  }, {
    sequelize,
    modelName: 'FarmTable',
  });
  return FarmTable;
};