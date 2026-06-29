const cron = require("node-cron");
const { Op } = require("sequelize");
const { appointments, user, services } = require("../models/index");
const sendEmail = require('./sendEmail');

const startReminderCron = () => {

    cron.schedule('*/58 */58 * * *', async () => {
        console.log('Running background cron job for appointment reminders...');

        try {
            const now = new Date();
    
            const currentTimeStr = now.toLocaleTimeString('en-GB', { timeZone: 'Asia/Kolkata', hour12: false });
            const todayLocalStr = now.toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' }); // Format: '2026-06-28'
            
            const twoHoursLater = new Date(now.getTime() + 2 * 60 * 60 * 1000);
            const targetTimeAhead = twoHoursLater.toLocaleTimeString('en-GB', { timeZone: 'Asia/Kolkata', hour12: false });   

           console.log(`🔍 Live Local Checking -> Date: ${todayLocalStr} | Window: ${currentTimeStr} TO ${targetTimeAhead}`);

            const todaysBookings = await appointments.findAll({
                where: {
                    status: 'confirmed',
                    isReminderSent: false
                },
                include: [
                    { model: user, attributes: ['name', 'email'] },
                    { model: services, attributes: ['serviceName'] }
                ]
            });

        const upcomingBookings = todaysBookings.filter(booking => {
            
            const dbDateStr = new Date(booking.appointmentDate).toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
            const dbTimeStr = booking.appointmentTime;

            const isDateMatch = (dbDateStr === todayLocalStr);
            const isTimeInWindow = (dbTimeStr >= currentTimeStr && dbTimeStr <= targetTimeAhead);

            return isDateMatch && isTimeInWindow;
            });

   
            if (upcomingBookings.length === 0) {
                console.log('No upcoming appointments found for reminders.');
                return;
            }

            for (const booking of upcomingBookings) {

                const customer = booking.user;
                const service = booking.service || booking.services;

                if (customer && customer.email) {
                    const subject = 'Appointment Reminder: See you soon! ⏰';
                    const text = `Hello ${customer.name},\n\nThis is a friendly reminder that your appointment for "${service.serviceName}" is scheduled for today.\nTime: ${booking.appointmentTime}\n\nPlease arrive 10 minutes early.\n\nBest regards,\nSalon Team`;

                await sendEmail(customer.email, subject, text);

                booking.isReminderSent = true;
                await booking.save();

                console.log(`Reminder email successfully sent to ${customer.email}`);
                }
            }

        } catch (error) {

            console.error('Error in reminder cron job:', error);

        }
    })
}

module.exports = startReminderCron;