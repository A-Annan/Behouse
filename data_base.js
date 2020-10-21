const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('Behouse', 'root', '123123123', {
    host: '127.0.0.1',
    dialect: 'mysql',
    port: '3306'
});



module.exports = sequelize;


