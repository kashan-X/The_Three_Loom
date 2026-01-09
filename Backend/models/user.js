'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
 User.init({
  name: DataTypes.STRING,
  email: DataTypes.STRING,
  password: DataTypes.STRING,
  cnic: DataTypes.STRING,
  userId: DataTypes.INTEGER,
  role: {
    type: DataTypes.STRING,
    defaultValue: 'customer' // Default to 'customer'
  }
}, {
  sequelize,
  modelName: 'User',
});

  return User;
};