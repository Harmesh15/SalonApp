const { appointments, user, services } = require('../models/index');
const { Op } = require('sequelize');

const getAllAppointments = async (req,res)=>{
      try{
        const AllAppointments = await appointments.findAll();
        res.status(200).json({message:AllAppointments});

      }catch(error){
        console.log(error);
        res.status(500).json({message:error.message});
      }
}




const updateAppointment = async (req, res) => {
  try {
    const { id } = req.params; // Appointment ID
    const { status, appointmentDate, appointmentTime } = req.body;

    const booking = await appointments.findByPk(id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    // Agar admin ne status badla ho (confirmed, completed, cancelled)
    if (status) booking.status = status;

    // Agar admin ne date ya time reschedule kiya ho
    if (appointmentDate) booking.appointmentDate = appointmentDate;
    if (appointmentTime) booking.appointmentTime = appointmentTime;

    await booking.save();
    res.status(200).json({ success: true, message: 'Appointment updated successfully', booking });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating appointment', error: error.message });
  }
};






const getAllCustomers = async (req, res) => {
  try {
    const customers = await user.findAll({
      where: { role: 'customer' }, // Agar role system hai, nahi to delete karke normal findAll chalayein
      attributes: ['id', 'name', 'email', 'phone', 'createdAt'],
      order: [['name', 'ASC']]
    });

    res.status(200).json({ success: true, customers });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching customers', error: error.message });
  }
};






const deleteCustomer = async (req, res) => {
  try {
    const { id } = req.params; // User ID

    const customerExists = await user.findByPk(id);
    if (!customerExists) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }

    // Cascade delete handle ho jayega agar core relations set hain, warna baseline delete:
    await user.destroy({ where: { id } });
    res.status(200).json({ success: true, message: 'Customer deleted successfully from management dashboard' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting customer', error: error.message });
  }
};

module.exports = {
    getAllAppointments,updateAppointment,deleteCustomer,getAllCustomers
}