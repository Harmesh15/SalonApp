const {Sequelize} = require("sequelize");

const sequelize = new Sequelize(
    "salon_appointment_booking",
    "root",
    "harmesh15",{
      host:"localhost",
      dialect:"mysql"
    });

  module.exports = sequelize;