const sequelize = require("../config/db");
const {DataTypes} = require("sequelize");

const user = sequelize.define("user",{
    id:{
      type:DataTypes.INTEGER,
      primaryKey:true,
      autoIncrement:true,
      allowNull:false,
    },
    name:{
     type:DataTypes.STRING,
     allowNull:false,
    },
    email:{
      type:DataTypes.STRING,
      allowNull:false
    },
    phone:{
        type:DataTypes.STRING,
        allowNull:false
    },
    password:{
      type:DataTypes.STRING,
      allowNull:false
    },
    role:{
      type:DataTypes.STRING,
       defaultValue: "user",
      allowNull:false
    }
})

module.exports = user;