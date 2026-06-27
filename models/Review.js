const sequelize = require("../config/db");
const {DataTypes} = require("sequelize");

const reviews = sequelize.define("reviews",{
    id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true,
        allowNull:false
    },
    userId:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    serviceId:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    rating:{
        type: DataTypes.DECIMAL(10,2),
        allowNull:false
    },
    review:{
        type:DataTypes.STRING,
        allowNull:false
    },
    staffReply:{
        type:DataTypes.INTEGER,
    }
})

module.exports = reviews;