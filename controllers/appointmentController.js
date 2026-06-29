const { appointments, staff, services, availability, user } = require('../models/index');
const sendEmail = require('../utils/sendEmail');
const { Op } = require('sequelize');


const getAvailableSlots = async (req,res)=>{
  console.log("viewAvlSlot hit");
    try{
         const { service_id, date } = req.query;

         if (!service_id || !date) {
      return res.status(400).json({ message: 'service_id and date are required' });
    }

  const dayOfWeek = new Date(date).toLocaleDateString('en-IN', { weekday: 'long' });

    const serviceSchedule = await availability.findOne({
      where: { service_id, day_of_week: dayOfWeek, is_available: true }
    });

    if (!serviceSchedule) {
      return res.status(200).json({ message: 'Salon or Service is closed on this day', slots: [] });
    }

    const selectedService = await services.findByPk(service_id);
    const duration = selectedService.duration_minutes;


    const bookedAppointments = await appointments.findAll({
      where: {
        serviceId:service_id,
        appointmentDate: date,
        status: { [Op.ne]: 'cancelled' } 
      },
      attributes: ['appointmentTime']
    });

    const bookedTimes = bookedAppointments.map(app => app.start_time);

    const slots = [];
    let current = new Date(`${date}T${serviceSchedule.start_time}`);
    const end = new Date(`${date}T${serviceSchedule.end_time}`);


    while (current < end) {
      const timeString = current.toTimeString().split(' ')[0];


      if (!bookedTimes.includes(timeString)) {
        slots.push(timeString);
      }

      current.setMinutes(current.getMinutes() + duration);
    }

    res.status(200).json({ day: dayOfWeek, available_slots: slots });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching slots', error: error.message });
  }
};





const bookAppointment = async (req,res)=>{
    console.log("Book appointment hit");
    try{
        const customerId = req.user.userId;
        const { serviceId, staffId, appointmentDate, appointmentTime } = req.body;

    if (!serviceId || !staffId || !appointmentDate || !appointmentTime) {
      return res.status(400).json({ message: 'All booking fields are required' });
    }

    const existingBooking = await appointments.findOne({
      where: { appointmentDate, appointmentTime, staffId, status: { [Op.ne]: 'cancelled' } }
    });

    if (existingBooking) {
      return res.status(400).json({ message: 'This slot is already booked for this staff member' });
    }

    const newAppointment = await appointments.create({
      userId: customerId, // ensure foreign key matching your schema
      serviceId,
      staffId,
      appointmentDate,
      appointmentTime,
      status: 'confirmed'
    });

    console.log("new appointment created",newAppointment);
    // for mail 
    const customerInfo = await user.findByPk(customerId);
    const serviceInfo = await services.findByPk(serviceId);

    const emailSubject = 'Salon Appointment Confirmed! 🎉';
    const emailText = `Hello ${customerInfo.name},\n\nYour appointment for "${serviceInfo.serviceName}"has been successfully booked.\nDate: ${appointmentDate}\nTime: ${appointmentTime}\n\nThank you for choosing our salon!`;
    
    await sendEmail(customerInfo.email, emailSubject, emailText);
    
    res.status(201).json({
      message: 'Appointment booked successfully and confirmation email sent!',
      appointment: newAppointment
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error booking appointment', error: error.message });
  }
};



const updateAppointment = (req,res)=>{
 
  

}










module.exports = {
    getAvailableSlots,bookAppointment
}