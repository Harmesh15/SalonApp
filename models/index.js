const user = require("../models/User");
const appointments = require("../models/Appointment");
const services = require("../models/Service");
const status = require("../models/Status");
const staff = require("../models/Staff");
const staffServices = require("../models/StaffServices");
const reviews = require("../models/Review");
const payment = require("../models/Payment");
const availability = require("../models/Availability");



user.hasMany(appointments);
appointments.belongsTo(user);

services.hasMany(appointments);
appointments.belongsTo(services);


services.belongsToMany(staff,{
    through:staffServices
});

staff.belongsToMany(services,{
    through:staffServices
});

appointments.hasOne(payment);
payment.belongsTo(appointments);

appointments.hasOne(reviews);
reviews.belongsTo(appointments);

module.exports = {
    user,appointments,services,status,staff,staffServices,reviews,payment,availability,
}