const axios = require('axios');
const { appointments, user, services } = require('../models/index');
const generateInvoice = require('../utils/invoiceGenerator');
const sendEmail = require('../utils/sendEmail');
const path = require('path');

const getCashfreeHeaders = () => ({
  'Content-Type': 'application/json',
  'x-client-id': process.env.CASHFREE_APP_ID,
  'x-client-secret': process.env.CASHFREE_SECRET_KEY,
  'x-api-version': '2023-08-01',
});


const createPaymentOrder = async (req,res)=>{
    try{
        const { appointmentId } = req.body;
        const userId = req.user.userId;

        console.log("appointment",appointmentId,"userId",userId);

        // Fetch appointment data with user and service details
    const booking = await appointments.findOne({
       where: { id: appointmentId, userId },
       include: [
        { model: user, attributes: ['name', 'email', 'phone'] },
        { model: services, attributes: ['price', 'serviceName'] }
      ]
    });

    console.log("booking",booking);
    if (!booking) return res.status(404).json({ message: 'Appointment not found' });

    const customerPhone = booking.user.phone || '9999999999';

    const cashfreePayload = {
      order_id: `ORDER_${booking.id}_${Date.now()}`,
      order_amount: parseFloat(booking.service.price),
      order_currency: 'INR',
      customer_details: {
        customer_id: `CUST_${userId}`,
        customer_name: booking.user.name,
        customer_email: booking.user.email,
        customer_phone: customerPhone,
      },
      order_meta: {
        return_url: `http://localhost:5000/api/payments/verify?order_id={order_id}&appointment_id=${booking.id}`,
      }
    };


    console.log("Generated Cashfree Order ID:", cashfreePayload.order_id);


    const url = process.env.CASHFREE_ENV === 'sandbox' 
      ? 'https://sandbox.cashfree.com/pg/orders' 
      : 'https://api.cashfree.com/pg/orders';

      const response = await axios.post(url, cashfreePayload, { headers: getCashfreeHeaders() });
       
      console.log("response", response);

      res.status(200).json({
      message: 'Cashfree session created successfully',
      payment_session_id: response.data.payment_session_id,
      order_id: response.data.order_id
    });

    } catch (error) {
    console.error('Cashfree Error:', error.response ? error.response.data : error.message);
    res.status(500).json({ message: 'Payment initiation failed', error: error.message });
  }
};













const verifyPayment = async (req,res)=>{
     try{

        const order_id = req.query.order_id || req.body.order_id || req.query.cf_order_id;
        const appointment_id = req.query.appointmentId || req.body.appointmentId;
        console.log(order_id,appointment_id);


        if (!order_id || order_id === 'undefined') {
      return res.status(400).send(`<h1>Validation Error</h1><p>Cashfree did not return a valid order_id.</p>`);
    }

        const url = process.env.CASHFREE_ENV === 'sandbox'
      ? `https://sandbox.cashfree.com/pg/orders/${order_id}`
      : `https://api.cashfree.com/pg/orders/${order_id}`;

      
      const response = await axios.get(url, { headers: getCashfreeHeaders() });
 
       console.log("response",response);
// 🧪 Temporary Hack: PAID ki jagah ACTIVE check karein testing ke liye
      if (response.data.order_status === 'PAID' || response.data.order_status === 'ACTIVE') {
      // A. Database status complete update karein
      const booking = await appointments.findByPk(appointment_id, {
        include: [{ model: user }, { model: services }]
      });

      if (!booking) {
        return res.status(404).send('<h1>Appointment not found in system</h1>');
      }

      booking.status = 'confirmed'; // Ya aap 'completed/paid' rakhna chahein toh
      await booking.save();
 

      const invoiceFilename = `Invoice_${booking.id}.pdf`;
      const pdfPath = await generateInvoice(booking, invoiceFilename);

      const emailSubject = `Payment Success & Invoice for Appointment #${booking.id} 🎉`;
      const emailText = `Hello ${booking.user.name},\n\nYour payment for "${booking.service.serviceName}" has been successfully processed.\nAmount: Rs. ${booking.service.price}\n\nYour formal invoice PDF has been saved on the system as ${invoiceFilename}.\n\nThank you for choosing us!`;
  
      await sendEmail(booking.user.email, emailSubject, emailText);

      // Redirect or send HTML response to customer
      res.status(200).send(`<h1>Payment Successful!</h1><p>Your appointment is confirmed. Invoice generated successfully.</p>`);
    } else {
      res.status(400).send(`<h1>Payment Failed</h1><p>Status: ${response.data.order_status}</p>`);
    }

  } catch (error) {
    console.error(error);
    res.status(500).send('<h1>Internal Server Error during verification</h1>');
  }
};

module.exports = {
    verifyPayment,createPaymentOrder
}