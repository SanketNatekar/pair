const jwt = require('jsonwebtoken');
require('dotenv').config();

const auth = (req,res,next) => {
    // const token = req.header('Authorization')?.split(' ')[1];

    // if(!token){
    //     return res.status(401).json({message: 'Access denied. No token provided'});
    // }

    // try{
    //     const decoded = jwt.verify(token,ProcessingInstruction.env.JWT_SECRET);
    //     req.user = decoded.userId;
    //     next();
    // }catch(err){
    //     return res.status(403).json({message : 'Invalid token'});
    // }

    const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Authorization header missing or malformed" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach decoded payload to request
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = auth;