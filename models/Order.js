module.exports = (sequelize, DataTypes) => {
    const Order = sequelize.define('Order', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      totalAmount: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      orderDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      orderStatus: {
        type: DataTypes.ENUM,
        values: ['pending', 'shipped', 'delivered', 'cancelled'],
        allowNull: false,
        defaultValue: 'pending',
      },
    });

    Order.associate = function (models) {
      Order.hasMany(models.OrderItem, { foreignKey: 'orderId' });
      Order.belongsTo(models.User, { foreignKey: 'userId' });
    };

    return Order;
  };
