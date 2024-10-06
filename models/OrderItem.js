module.exports = (sequelize, DataTypes) => {
    const OrderItem = sequelize.define('OrderItem', {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true
        },
        orderId: {
          type: DataTypes.INTEGER,
          allowNull: false
        },
        productId: {
          type: DataTypes.INTEGER,
          allowNull: false
        },
        quantity: {
          type: DataTypes.INTEGER,
          allowNull: false
        },
        price: {
          type: DataTypes.FLOAT,
          allowNull: false
        }
      });

      OrderItem.associate = function(models) {
        OrderItem.belongsTo(models.Order, { foreignKey: 'orderId' });
        OrderItem.belongsTo(models.Book, {
            foreignKey: 'productId',
            onDelete: 'CASCADE',
        });
      };

      return OrderItem;
};
