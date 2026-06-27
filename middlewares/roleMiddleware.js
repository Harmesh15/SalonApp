const jwt = require("jsonwebtoken");
const user = require("../models/User");

const roleMiddleWare = async (req,res,next)=>{

    const token = req.headers.authorization.split(" ")[1];

    if(!token){
        return res.status(401).json({message:"Access Denied: No Token Provided"});
    }

    const decode = jwt.verify(token,"harmesh15");

    if(!decode){
        return res.status(400).json({message:"token invalid"});
    }
  
    req.user = decode;
    next();
    

}

const isAdmin = (req, res, next) => {
  // verifyToken chalne ke baad req.user active ho jata hai
  if (req.user && req.user.role === 'admin') {
    next(); // Agar admin hai toh aage badhne do
  } else {
    return res.status(403).json({ message: 'Access Denied: Admins Only!' });
  }
};