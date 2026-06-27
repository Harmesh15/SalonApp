const sequelize = require("../config/db");
const {DataTypes} = require("sequelize");

const staffServices = sequelize.define("staffServices",{
    id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true,
        allowNull:false
    },
    staffId:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    serviceId:{
        type:DataTypes.INTEGER,
        allowNull:false
    }
})

module.exports = staffServices;