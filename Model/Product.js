const {DataTypes, Model} = require('sequelize');
const sequelize = require('../data_base');
const cart = require('./Cart');
const productQte = require('./ProductQte');


const product = sequelize.define('Product', {
    price: {
        type: DataTypes.DOUBLE,
    },
    image: {
        type: DataTypes.STRING,
    },
    hover_image: {
        type: DataTypes.STRING,
    },
    home_image: {
        type: DataTypes.STRING,
    },
    designation: {
        type: DataTypes.STRING,
    },
    description: {
        type: DataTypes.STRING,
    },
    category: {
        type: DataTypes.STRING,
    },
    ratings: {
        type: DataTypes.INTEGER,
    },
    cart_image: {
        type: DataTypes.STRING,
    },
    qte_stock: {
        type: DataTypes.INTEGER
    }
});


module.exports = product;
