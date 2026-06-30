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
    userId:{
         type:DataTypes.INTEGER,
         allowNull:false
    },
    amount:{
        type: DataTypes.DECIMAL(10,2),
        allowNull:false
    },
    paymentStatus:{
        type:DataTypes.STRING,
        allowNullL:false
    },
    transactionId:{
        type:DataTypes.STRING,
        allowNull:false
    },
    paymentMode:{
        type:DataTypes.STRING,
        allowNull:false
    },
    paymentDate:{
        type:DataTypes.DATE,
        allowNull:false
    }
})

module.exports = payment;