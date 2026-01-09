'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addConstraint('Orders', {
      fields: ['productId'],
      type: 'foreign key',
      name: 'fk_orders_productId', 
      references: {
        table: 'Products',
        field: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint('Orders', 'fk_orders_productId');
  }
};
