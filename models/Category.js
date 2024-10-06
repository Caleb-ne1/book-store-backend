module.exports = (sequelize, DataTypes) => {
    const Category = sequelize.define('Category', {
        category_name: {
            type: DataTypes.STRING,
            allowNull: false
        }
    })

    Category.associate = (models) => {
        Category.belongsTo(models.User, {
            onDelete: 'CASCADE',
            allowNull: false
        })
    }
    return Category;
}
