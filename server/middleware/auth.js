const jwt = require("jsonwebtoken");
const Usermodel = require("../models/Usermodel")
//model is optional

exports.checkLoginOrNot = async(req, res, next) => {
  // console.log("token checker",req.cookies);

  const token =
    req.cookies.token ||
    req.body.token 
    
    // req.header("Authorization").replace("Bearer ", "");
    
  if (!token) {
    return res.status(404).json("token is missing, Please login");
  }

  try {
    const decode = jwt.verify(token, process.env.SECRET_KEY);
    // console.log("decode",decode);

    //this req.user is custom req that we are injecting now we can use whereEver token is present
    req.user = await Usermodel.findById(decode.id)

    // bring in info from DB
  } catch (error) {
    return res.status(401).send("Invalid Token");
  }
  return next();
};