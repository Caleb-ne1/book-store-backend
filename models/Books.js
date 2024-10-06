
module.exports = (sequelize, DataTypes) => {
    const Book = sequelize.define('Book', {
        title : {
            type: DataTypes.STRING,
            allowNull: false,

        },
        author: {
            type: DataTypes.STRING,
            allowNull: false
        },
        price : {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        stock: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false
        },
        category: {
            type: DataTypes.STRING,
            allowNull: false
        },
        image_url: {
            type: DataTypes.STRING,
            allowNull: false
        }
    })
    Book.associate = (models) => {
        Book.belongsTo(models.User, {
            onDelete: 'CASCADE',
            allowNull: false
        })
    };

    return Book;
}
