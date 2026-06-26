'use strict';
const {
  Model
} = require('sequelize');

const { Enums } = require('../utils/common')
const {ADMIN, CUSTOMER, FLIGHT_COMPANY} = Enums.USER_ROLES
module.exports = (sequelize, DataTypes) => {
  class Role extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsToMany(models.User, {
        through: models.User_Role,
        as: 'users',
        foreignKey: 'role_id',
        otherKey: 'user_id',
      });
    }
  }
  Role.init({
    name: {
      type : DataTypes.ENUM(ADMIN, CUSTOMER, FLIGHT_COMPANY),
      allowNull: false,
      defaultValue: CUSTOMER
    }
  }, {
    sequelize,
    modelName: 'Role',
  });
  return Role;
};
