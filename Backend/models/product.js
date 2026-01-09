'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Define associations
     */
    static associate(models) {
      // 🔗  A product can appear in many orders
      Product.hasMany(models.Order, {
        foreignKey: 'productId',
        as: 'orders'
      });
    }
  }

  Product.init(
    {
      name:        DataTypes.STRING,
      description: DataTypes.STRING,
      price:       DataTypes.DECIMAL,
      category:    DataTypes.STRING,
      sizes:       DataTypes.STRING,
      colors:      DataTypes.STRING,
      images:      DataTypes.STRING,
      stock:       DataTypes.INTEGER,
      isFeatured:  DataTypes.BOOLEAN
    },
    {
      sequelize,
      modelName: 'Product',
      tableName: 'Products',
      timestamps: true
    }
  );

  return Product;
};
