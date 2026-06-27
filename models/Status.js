const sequelize = require("../config/db");
const {DataTypes} = require("sequelize");

const status = sequelize.define("status",{
    Pending:{
        type:DataTypes.BOOLEAN,
        allowNull:false
    },
    Confirmed:{
        type:DataTypes.BOOLEAN,
        allowNull:false
    },
    Completed:{
        type:DataTypes.STRING,
        allowNull:false
    },
    Cancelled:{
        type:DataTypes.STRING,
        allowNull:false
    },
    Rescheduled:{
        type:DataTypes.STRING,
        allowNull:false
    }
})

module.exports = status;