const sequelize = require("../config/db");
const {DataTypes} = require("sequelize");

const services = sequelize.define("services",{
    id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
    },
    serviceName:{
        type:DataTypes.STRING,
        allowNull:false
    },
    description:{
        type:DataTypes.STRING,
        allowNull:false
    },
    duration_minutes:{
        type:DataTypes.STRING,
        allowNull:false
    },
    price:{
        type: DataTypes.DECIMAL(10,2),
        allowNull:false
    }
})

module.exports = services;