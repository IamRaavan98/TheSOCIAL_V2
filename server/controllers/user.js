require("dotenv").config;
const bcrypt = require("bcrypt");
const Usermodel = require("../models/Usermodel");
const jwt = require("jsonwebtoken");
const { findById } = require("../models/Usermodel");

//register
exports.register = async (req, res) => {
  try {


    if (!req.body.username || !req.body.password || !req.body.email) {
      return res.status(404).send("Please provide email,username,password");
    }
    if (await Usermodel.findOne({ email: req.body.email })) {
      return res.status(401).send("user already registered");
    }

    //generate Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    //store data in DB
    const newUser = await new Usermodel({
      username: req.body.username.toLowerCase(),
      email: req.body.email,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(200).json({
      success: true,
      message: newUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//login
exports.login = async (req, res) => {
  try {
    //collected information from frontend
    const {email, password} = req.body
    //validate
    if (!email || !password) {
      return  res.status(401).send("email and password is required")
    }
  
    //check user in database
    const user = await Usermodel.findOne({email})
    //if user does not exists - assignment
    //match the password

    if(user === null){
     
    return res.status(401).send("email or password is incorrect")
    }
    if (await bcrypt.compare(password, user.password)) {
        const token = jwt.sign({id: user._id, email}, process.env.SECRET_KEY, {expiresIn: '2h'})
        user.password = undefined
        user.token = token

      const options = {
          domain:process.env.REACT_APP_URL,
            expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
            httpOnly: true
        }
      return res.status(200).cookie("token", token, options).json({
            success: true,
            token,
            user
        })

    }
    else{
      return res.status(400).send("password is incorrect")
    }
  
} catch (error) {
   return res.status(500).json({
      success:false,
      message:error.message
    })
}

};


exports.logout = async (req, res) => {
  try {
    res.clearCookie("token");
    res.status(200).json({
      success: true,
      message: "You are logout",
    });
  } catch (error) {
    res.status(400).send(error.message);
  }
};

exports.updatePassword = async (req, res) => {
  const user = await Usermodel.findOne({ _id: req.params.id });

  if (user || req.user.isAdmin) {
    if (req.body.password) {
      try {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
        if (bcrypt.compare(user.password, req.body.password)) {
          return res
            .status(500)
            .send("Cant Update as new Password is same as Old password");
        }

        user.password = req.body.password;
        await user.save();
        return res.status(200).send("password has been updated");
      } catch (error) {
        return res.status(400).send(error.message);
      }
    } else {
      return res.status(404).send("New Password Not Found");
    }
  } else {
    return res.status(403).json("Only Admin Can Update");
  }
};

// delete a user
exports.deleteUser = async (req, res) => {
  if (req.params.id || req.user.isAdmin) {
    try {
      const user = await Usermodel.findOneAndDelete({ _id: req.params.id });

      if (!user) {
        return res
          .status(403)
          .send("Account is already deleted or invalid id in params");
      }
      return res.status(200).send("Account has been deleted");
    } catch (error) {
      return res.status(400).send(error.message);
    }
  }
  res.status(404).send("please provide user id in params");
};

//get a User
exports.getUser = async (req, res) => {
  try {
    if (!req.params.id) {
      return res.status(404).send("User id not found in params");
    }
    const user = await Usermodel.findById(req.params.id);
    
    const { password, updatedAt, ...other } = user._doc;
    res.status(200).json(other);
  } catch (error) {
    res.status(500).json(error);
  }
};

//follow
// id in param is the user id which current user wants to follow
exports.addFriend = async (req, res) => {
  if (!req.params.id) {
    return res.status(400).send("user not found");
  } else{
    try {
      const user = await Usermodel.findById(req.params.id);
      const currentUser = req.user;
      if(JSON.stringify(user._id) === JSON.stringify(currentUser._id)){
        return res.status(400).send("you cant follow yourself")
      }
     
      if (!currentUser.friends.includes(user._id)) {
        await currentUser.updateOne({ $push: { friends: user._id } });
        await user.updateOne({ $push: { friends: currentUser._id } });
        
        res.status(200).json("user has been followed");
      } else {
        res.status(403).json("you already follow this user");
      }
    } catch (error) {
      res.status(500).send(error.message);
    }
  }
};

// unfollow
exports.unFriend = async (req, res) => {
  if (!req.params.id) {
    return res.status(400).send("user not found");
  } else {
    try {
      const user = await Usermodel.findById(req.params.id);
      if(!user){
        return res.status(404).send("the user trying to unfriend is not found`")
      }
      if (req.user.friends.includes(req.params.id)) {
        await user.updateOne({ $pull: { friends: req.user._id } });
        await req.user.updateOne({ $pull: { friends: user._id } });
        res.status(200).json("user has been unfriend");
      } else {
        res.status(403).json("you already unfriend this user");
      }
    } catch (error) {
      res.status(500).send(error.message);
    }
  }
};

//here any user whose id is in parmas its friend list will be there
exports.friendList = async(req,res)=>{
    if(!req.params.id){
     return res.status(404).send("provide user id in params")
    }
    const user = await Usermodel.findById(req.params.id)
    if(!user){
      return res.status(404).send("user not found");
    }
  try {
    const friendList = await Promise.all(
      user.friends.map((friendsId) => {
        return Usermodel.findById(friendsId);
      })
      );
      res.status(200).json(friendList);
  } catch (error) {
    res.status(500).send(error.message)
  }
}

exports.userUpdate = async(req,res)=>{
  const {city,relationship,from} = req.body

  // console.log("user",user);
  if(!city && !relationship && !from){
    return res.status(404).send('No city,from,relationship, found')
  }
 try {
   const user = await Usermodel.findById(req.user._id)

  if(!user){
    throw new Error("user not found")
  }
  if(city){
      user.city = city;
  }
   if(relationship){
    user.relationship = relationship;
  }
  if(from){
    user.from = from
  }
  await user.save()
  res.status(200).json({
    success:true,
    message:user
  })
 } catch (error) {
   res.status(500).send(error.message) 
 }
}

exports.AlluserList = async(req,res)=>{
  try {
    const user = await Usermodel.find();
    if(!user){
      return res.status(404).send("user not found")
    }
    else{
      let userAllarray = []
      for (let index = 0; index < user.length; index++) {
        
        userAllarray.push({
          username:user[index].username,
          id:user[index]._id,
        })
        
      }
      res.status(200).json({
        success:true,
        message:userAllarray
      })
  }
  
  } catch (error) {
    res.status(500).json({
      success:false,
      message:error.message,
    })
  }

}