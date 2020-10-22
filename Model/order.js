const {DataTypes, Model} = require('sequelize');
const sequelize = require('../data_base');



const order = sequelize.define('order', {
    state:{
        type: DataTypes.STRING,
        defaultValue: 'none Confirmed'
    }
})


module.exports =  order;
