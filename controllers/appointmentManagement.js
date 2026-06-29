const { appointments, services } = require('../models/index');
const { Op, where } = require('sequelize');

const cancelAppointment = async (req, res) => {
    console.log("cancel controller hit");
    try {
        const { id } = req.params;
        const userId = req.user.userId;
        console.log("id is", id, "userId is", userId);

        const appointment = await appointments.findOne({
            where: { id, userId }
        });
        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found or unauthorized' });
        }
        if (appointment.status === 'cancelled') {
            return res.status(400).json({ message: 'Appointment is already cancelled' });
        }
        appointment.status = 'cancelled';
        await appointment.save();

        res.status(200).json({
            message: 'Appointment cancelled successfully',
            appointment
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error cancelling appointment', error: error.message });
    }
}


const rescheduleAppointment = async (req, res) => {
    console.log("reschedule controler hit")
    try {
        const { id } = req.params;
        const userId = req.user.userId;
        console.log("id is", id, "userId is", userId);
        const { new_date, new_time } = req.body;

        if (!new_date || !new_time) {
            return res.status(400).json({ message: 'New date and time are required' });
        }

        const appointment = await appointments.findOne({ where: { id, userId } });

        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found or unauthorized' });
        }

        if (appointment.status === 'cancelled') {
            return res.status(400).json({ message: 'Cannot reschedule a cancelled appointment' });
        }

        const slotConflict = await appointments.findOne({
            where: {
                id: { [Op.ne]: id },
                staffId: appointment.staffId,
                appointmentDate: new_date,
                appointmentTime:  new_time,
                status: { [Op.ne]: 'cancelled' }
            }
        });

        if (slotConflict) {
            return res.status(400).json({ message: 'The requested time slot is already booked for this staff member' });
        }

        appointment.appointmentDate = new_date;
        appointment.appointmentTime = new_time;
        appointment.isReminderSent = false;

        await appointments.save();

        res.status(200).json({
            message: 'Appointment rescheduled successfully',
            appointment
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error rescheduling appointment', error: error.message });
    }

}


module.exports = {
    rescheduleAppointment, cancelAppointment
}