const {DataTypes, Model} = require('sequelize');
const sequelize = require('../data_base');


class Images extends Model {}

Images.init({
    url: {
        type: DataTypes.STRING,
    }
},
    {
        sequelize
    })

module.exports = Images;
