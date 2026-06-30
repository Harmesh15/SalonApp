const { reviews, appointments, user } = require('../models/index');

const leaveReview = async (req,res)=>{
    try{

        const userId = req.user.userId;
        const { appointmentId, rating, review } = req.body;

        if (!appointmentId || !rating) {
      return res.status(400).json({ message: 'Appointment ID and rating are required' });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    const booking = await appointments.findOne({
      where: { id: appointmentId, userId }
    });


    if (!booking) {
      return res.status(44).json({ message: 'Appointment not found or unauthorized' });
    }

    const existingReview = await reviews.findOne({ where: { appointmentId } });

    if (existingReview) {
      return res.status(400).json({ message: 'You have already left a review for this appointment' });
    }

    const newReview = await reviews.create({
      appointmentId,
      userId,
      staffId: booking.staffId, // Kis staff ko review mila
      serviceId:booking.serviceId,
      rating,
      review,
    });

    res.status(201).json({ message: 'Review submitted successfully', review: newReview });

    } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error leaving review', error: error.message });
  }
};






const getAllReviews = async (req,res)=>{
    try{
        const { staffId } = req.query;
  
        const whereClause = {};
    if (staffId) whereClause.staffId = staffId;

    const allReviews = await reviews.findAll({
        where:whereClause,
        include:[
            {model: user, attributes:['name']}
        ],
        order:[['createdAt', 'DESC']]
    });

         res.status(200).json({message:"all reviews ", allReviews});
    }catch(error){
        console.log(error);
        res.status(500).json({ message: 'Error fetching reviews', error: error.message });
    }
};




const respondToReview = async (req,res)=>{
    try{  
    const { reviewId } = req.params;
    const { staffReply } = req.body;

    if (!staffReply) {
      return res.status(400).json({ message: 'Reply text cannot be empty' });
    }
    const review = await reviews.findByPk(reviewId);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    review.staffReply = staffReply; // Ensure karein aapke model me ye column ho
    await review.save();  

    res.status(200).json({ message: 'Response added successfully', review });
    }catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error responding to review', error: error.message });
  }
}



module.exports = {
    getAllReviews,leaveReview,respondToReview
}