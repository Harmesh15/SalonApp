const service = require("../models/Service");
const availability = require("../models/Availability");
const { where } = require("sequelize");

const createService = async (req,res)=>{
    console.log("create Service controller hit");
    try{ 
        const {name,description,duration_minutes,price} = req.body;

        const response = await service.create({
            serviceName:name,
            description:description,
            duration_minutes:duration_minutes,
            price:price
        })

        res.status(201).json({message:"services created"});
    
    }catch(error){
        console.log(error);
    }
}

const getAllServices = async (req,res)=>{
    console.log(" getAllservice  controller hit");
    try{
        const services = await service.findAll({
            include:[{model:availability}]
        });
        res.status(200).json(services)
    }catch(error){
        console.log(error);
        res.status(500).json({message:"Error fetching services"});
    }
}

const updateService = async (req,res)=>{
    console.log("service update controller hit");
    try{
        const id = req.params.id;
        const {name,description,duration,price} = req.body;

    const serviceUpdated =  await service.update({
            serviceName:name,
            description:description,
            duration_minutes:duration,
            price:price
        },{where:{id}});

        res.status(200).json({ message: 'Service updated successfully', serviceUpdated });
    }catch(error){
        console.log(error);
        res.status(500).json({ message: 'Error updating service' });
    }
}

const deleteService = async (req,res)=>{
    console.log("delete service controller hit");
    try{
        const id = req.params.id;
        const deletedCount = await service.destroy({where:{id}});

        if (deletedCount === 0){
             return res.status(404).json({ message: 'Service not found' });
        }
        res.status(200).json({message:"services deleted successfully"});
    }catch(error){
        console.log(error);
        res.status(500).json({ message: 'Error deleting service' });
    }
}



const setServiceAvailability = async (req,res)=>{
    console.log("setServiceAvailability controller hit");
    try{
       const { service_id, day_of_week, start_time, end_time, is_available } = req.body;

       const isAvailable = await availability.findOne({
         service_id,day_of_week
       });

       console.log(isAvailable);
       if(isAvailable){
        await availability.update({
            start_time, end_time, is_available
        },{where:{ service_id,day_of_week}});

        return res.status(200).json({message:'Availability updated successfully', availability})

       }else{
        const newAvailability = await availability.create({  
            service_id,
            day_of_week,
            start_time,
            end_time,
            is_available
        })
        return res.status(201).json({message:'new availability set successfully ' ,availability:newAvailability});
       }
    }catch(error){
        console.log(error)
        res.status(500).json({message:'issue in service availability'});
    }
}

module.exports = {
    createService,updateService,
    deleteService,getAllServices,setServiceAvailability
};