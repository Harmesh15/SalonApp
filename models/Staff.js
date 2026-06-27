const sequelize = require("../config/db");
const {DataTypes} = require("sequelize");

const staff = sequelize.define("staff",{
    id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true,
        allowNull:false
    },
    name:{
        type:DataTypes.STRING,
        allowNull:false
    },
    phone:{
        type:DataTypes.INTEGER,
        allowNull:true
    },
    specialization:{
        type:DataTypes.STRING,
        allowNull:false
    },
    availability:{
        type:DataTypes.STRING,
        allowNull:true
    }
})

module.exports = staff;