const sequelize = require("../config/db");
const {DataTypes} = require("sequelize");

const payment = sequelize.define("payment",{
    id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true,
        allowNull:false
    },
    appointmentId:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    amount:{
        type: DataTypes.DECIMAL(10,2),
        allowNull:false
    },
    paymentMethod:{
        type:DataTypes.STRING,
        allowNullL:false
    },
    transactionId:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    status:{
        type:DataTypes.INTEGER,
        allowNull:false
    }

})

module.exports = payment;