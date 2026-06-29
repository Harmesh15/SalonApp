require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const sequelize = require("./config/db");
require("./models/index");
const startReminderCron = require('./utils/reminderScheduler');

// routers 
const userRouter = require("./routes/userRoutes");
const serviceRouter = require("./routes/serviceRoutes");
const staffRouter = require("./routes/staffRoutes");
const bookingRouter = require("./routes/appointmentRoutes");
const appointmentManagement = require("./routes/appointmentManagementRoute");


app.use(express.json());
app.use(express.static("public"));
app.use(cors());


app.use("/user",userRouter);
app.use("/service",serviceRouter);
app.use("/staff",staffRouter);
app.use("/apointment",bookingRouter);
app.use("/mangeApt",appointmentManagement);

const PORT = 8000;

sequelize.authenticate()
.then(()=>{
    console.log("DB connected");
    return sequelize.sync({alter:false});
}).then(()=>{
     console.log("DB synchronised");

     app.listen(PORT,()=>{
        console.log("Server is listening on port no :",process.env.PORT);
        startReminderCron();
    });
})
.catch((error)=>{
    console.log(error.message);
});