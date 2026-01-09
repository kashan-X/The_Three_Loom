'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Define associations
     * This is called automatically by /models/index.js
     */
    static associate(models) {
      // 🔗  An order belongs to exactly one product
      Order.belongsTo(models.Product, {
        foreignKey: 'productId',
        as: 'product',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });
    }
  }

  Order.init(
    {
      customerEmail: DataTypes.STRING,
      fullName:      DataTypes.STRING,
      phoneNumber:   DataTypes.STRING,
      address:       DataTypes.STRING,
      city:          DataTypes.STRING,
      whatsappNumber:DataTypes.STRING,
      shippingMethod:DataTypes.STRING,
      paymentMethod: DataTypes.STRING,
      billingAddress:DataTypes.STRING,
      productId:     DataTypes.INTEGER,
      quantity:      DataTypes.INTEGER,
      totalPrice:    DataTypes.DECIMAL
    },
    {
      sequelize,
      modelName: 'Order',
      tableName: 'Orders',          // keep table name explicit
      timestamps: true              // createdAt / updatedAt
    }
  );

  return Order;
};
