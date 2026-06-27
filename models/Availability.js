const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Service = require('./Service');

const Availability = sequelize.define('Availability', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  day_of_week: {
    type: DataTypes.STRING, // e.g., 'Monday', 'Tuesday'
    allowNull: false
  },
  start_time: {
    type: DataTypes.TIME, // HH:MM:SS format automatically handled for MySQL
    allowNull: false
  },
  end_time: {
    type: DataTypes.TIME,
    allowNull: false
  },
  is_available: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  timestamps: true
});

// Relationships (Foreign Key Configuration)
Service.hasMany(Availability, { foreignKey: 'service_id', onDelete: 'CASCADE' });
Availability.belongsTo(Service, { foreignKey: 'service_id' });

module.exports = Availability;