const {DataTypes, Model} = require('sequelize');
const sequelize = require('../data_base');

class User extends Model {}


User.init({
    first_name: {
        type: DataTypes.STRING
    },
    last_name: {
        type: DataTypes.STRING
    },
    email: {
        type: DataTypes.STRING
    },
    password: {
        type: DataTypes.STRING
    },
    address: {
        type: DataTypes.STRING
    },
    city: {
        type: DataTypes.STRING
    },
    zip_code: {
        type: DataTypes.STRING
    },
    phone_number: {
        type: DataTypes.STRING,
    },
    comment: {
        type: DataTypes.TEXT,
    },
},{
    sequelize
})


module.exports = User;







