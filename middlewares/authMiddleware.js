const jwt = require("jsonwebtoken");
// const user = require("../models/User");

const verifyToken = async (req,res,next)=>{

    const token = req.headers.authorization.split(" ")[1];

      if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  console.log(token);
  try{

     const decoded = jwt.verify(token,"harmesh15");

    req.user = decoded
    next();

  }catch(error){
    return res.status(401).json({ message: "Invalid token" });
  }
};

const isAdmin = (req, res, next) => {

    const token = req.headers.authorization.split(" ")[1];

      if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  console.log(token);

     const decoded = jwt.verify(token,"harmesh15");
     req.user = decoded

  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({ message: 'Access Denied: Admins Only!' });
  }
};

module.exports = {
  verifyToken,
  isAdmin
};