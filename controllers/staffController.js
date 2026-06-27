const services = require("../models/Service");
const staff = require("../models/Staff");


// add new staff profile

const addStaff = async (req, res) => {
    console.log("addStaff controller hit");
    try {

        const { name, email, specialization,phone,availability } = req.body;

        if (!name || !email) {
            return res.status(400).json({ message: 'Name and Email are required' });
        }

        const newSatff = await staff.create({
            name,
            email,
            specialization,
            phone,
        })

        return res.status(201).json({ message: "Staff profile created successfully", staff: newSatff });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error adding staff', error: error.message });
    }
}


const getAllStaff = async (req, res) => {
    console.log("getAllStaff controller hit staff");
    try {
        const staffList = await staff.findAll({
            include: [{
                model: services,
                attributes: ['id', 'serviceName', 'price'],
                through: { attributes: [] }
            }]
        });

       res.status(200).json({ staff: staffList });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message:"error in fetch staff", error: error.message });
    }
}


const assignServices = async (req, res) => {
    console.log("assignServices staff controller hit");
    try {
        const { id } = req.params;
        console.log("Ye id hai staff ki",id);
        const { service_id } = req.body;

        const getstaff = await staff.findByPk(id);

        if (!getstaff) {
            return res.status(404).json({ message: 'Staff member not found' });
        }

        await getstaff.setServices(service_id);

        res.status(200).json({
            message: 'Services assigned to staff successfully'
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "error in assignServices", error: error.message });
    }
}


const deleteStaff = async (req, res) => {
    console.log("delete staff controller hit");
    try {
        const { id } = req.params;
        const deletedCount = await staff.destroy({ where: { id } });

        if (deletedCount === 0) {
            return res.status(404).json({ message: 'Staff not found' });
        }

        res.status(200).json({ message: 'Staff profile deleted successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "error in delete Staff", error: error.message });
    }
}


module.exports = {
    addStaff,getAllStaff,assignServices,deleteStaff
}