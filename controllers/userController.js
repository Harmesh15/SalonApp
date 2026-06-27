const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const user = require("../models/User");


const register = async (req, res) => {
    console.log("registration form hit");
    const { name, email, phone, password, role } = req.body;
    try {

        const hashedPass = await bcrypt.hash(password, 10);
        console.log("this is hashed password", hashedPass);


        const response = await user.create({
            name: name,
            email: email,
            phone: phone,
            role: role,
            password: hashedPass
        })
        console.log(response);
        res.status(200).json({data:response});

    } catch (error) {
        console.log(error);
        res.status(500).json({ messagge: "Server side issue" });
    }
}


const login = async (req, res) => {
    console.log("login controller clicked");
    const { email, password } = req.body;
    console.log(email,password);

    try {
        if (!email || !password) {
            return res.status(404).json({ message: "All field required" });
        }

        const isuser = await user.findOne({
            where: { email }
        })
         
        console.log("this is login user",isuser);
        if (!isuser) {
            return res.status(404).json({ message: "User not Found" });
        }

        const ismatched = await bcrypt.compare(password, isuser.password);
        console.log("is match value is:",ismatched);

        if (!ismatched) {
            return res.status(404).json({ message: "email or password is wrong" });
        }

        const token = jwt.sign({ 
            userId: isuser.id,
            role:isuser.role
         },
             "harmesh15",
         { expiresIn: "1h" }
        );

        res.status(200).json({ response: token });
        console.log("this is token",token);

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "server side problem" });
    }
}


const userProfile = async (req,res)=>{
    const id = req.user.userId;
    console.log("profile controller hit");

    try{
           const isUser = await user.findAll({where:{id}});
           console.log(isUser);

    if(!isUser){
        return res.status(400).json({message:"User not found"});
    }
    console.log(isUser);
    res.status(200).json(isUser);

    }catch(error){
        console.log(error);
    }
}

const updateProfile = async (req,res)=>{
    console.log("update controller hit");
    const id = req.user.userId;
    const {name,email,phone,role} = req.body;
    try{
           await user.update({
            name:name,
            email:email,
            phone:phone,
            role:role
        },{ where:{id}});

        res.status(200).json({message:"user updated"});
        
    }catch(error){
        console.log(error);
    }
}

module.exports = { login, register ,userProfile,updateProfile};