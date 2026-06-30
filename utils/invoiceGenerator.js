const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

const generateInvoice = async (booking,filename)=>{
      try{
   
        const doc = new PDFDocument({size:'A4', margin:50});
        const filePath = path.join(__dirname, '../invoices/${filename}');

        const invoicesDir = path.join(__dirname,'../invoices');
          if(!fs.existsSync(invoicesDir)){
            fs.mkdirSync(invoicesDir,{recursive:true});
          }

        const writeStream = fs.createWriteStream(filePath);
          doc.pipe(writeStream);


        doc.fontSize(20).text('GLAMOUR SALON', { align: 'center' }).moveDown();
        doc.fontSize(10).text('INVOICE / RECEIPT', { align: 'center' }).moveDown(2);

        doc.text(`Invoice No: INV-${booking.id}-${Date.now().toString().slice(-4)}`);
        doc.text(`Date: ${new Date().toLocaleDateString('en-IN')}`);
        doc.text(`Status: PAID (Online via Cashfree)`).moveDown();

        doc.text('------------------------------------------------------------').moveDown();


    doc.text(`Customer Name: ${booking.user ? booking.user.name : 'Guest'}`);
    doc.text(`Email: ${booking.user ? booking.user.email : 'N/A'}`);
    doc.text(`Appointment Date: ${booking.appointmentDate}`);
    doc.text(`Appointment Time: ${booking.appointmentTime}`).moveDown();

    doc.text('------------------------------------------------------------').moveDown();

    doc.fontSize(12).text('Service Description', 50, doc.y, { width: 300 });
    doc.text('Amount (INR)', 400, doc.y, { align: 'right' }).moveDown();
    
    doc.fontSize(10);
    const serviceName = booking.service ? booking.service.serviceName : 'Salon Service';
    const price = booking.service ? booking.service.price : '0.00';
    
    doc.text(serviceName, 50, doc.y, { width: 300 });
    doc.text(`Rs. ${price}`, 400, doc.y, { align: 'right' }).moveDown(2);

    doc.text('------------------------------------------------------------').moveDown();

    // --- Total ---
    doc.fontSize(12).text('Grand Total:', 300, doc.y);
    doc.text(`Rs. ${price}`, 400, doc.y, { align: 'right' }).moveDown(2);

    // --- Footer ---
    doc.fontSize(10).text('Thank you for visiting Glamour Salon! See you again.', { align: 'center' });

    // File writing complete karein
    doc.end();

    await new Promise((resolve,reject)=>{
        writeStream.on('finish', resolve);
        writeStream.on('error', reject);
    });
    return filePath;
      }catch (error) {
    console.error('Error generating PDF Invoice:', error);
    throw error; // Bubble up error so controller can catch it
  }
}


module.exports = generateInvoice;