const {DataTypes} = require('sequelize');
const sequelize = require('../data_base');
const cart = require('./Cart');
const product = require('./Product');

const productQte = sequelize.define('productQte',{
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    qte : {
        type: DataTypes.INTEGER
    }
});



module.exports = productQte;
