const sequelize = require("../config/db");
const {DataTypes} = require("sequelize");

const appointments = sequelize.define("appointments",{
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
    staffId:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    appointmentDate:{
        type:DataTypes.DATE,
        allowNull:false
    },
    appointmentTime:{
        type:DataTypes.TIME,
        allowNull:false
    },
    status:{
        type:DataTypes.STRING,
        allowNull:false
    },
    isReminderSent: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
})

module.exports = appointments;