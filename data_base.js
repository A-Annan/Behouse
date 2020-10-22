const { Sequelize } = require('sequelize');


const sequelize = new Sequelize('behouse', 'abdelilah', 'A7azerty', {
    host: '157.230.181.60',
    dialect: 'mysql',
    port: '3306',

});



module.exports = sequelize;


