const express = require("express");
const { checkLoginOrNot } = require("../middleware/auth");
const userRoutes = express.Router();
const { register, 
        login, 
        updatePassword,
        deleteUser,
        getUser,
        logout,
        addFriend,
        unFriend,
        friendList,
        userUpdate,
        AlluserList} = require("../controllers/user");

userRoutes.get("/",(req,res)=>{
    res.status(400).send("welcome to the user routes")
})

userRoutes.post("/register",register)
userRoutes.post("/login",login)
userRoutes.post("/userUpdate",checkLoginOrNot,userUpdate)
userRoutes.get("/logout",logout)
userRoutes.put("/updatePassword/:id",checkLoginOrNot,updatePassword);
userRoutes.delete("/deleteUser/:id",checkLoginOrNot,deleteUser);
userRoutes.get("/getUser/:id",checkLoginOrNot,getUser);
userRoutes.put("/addFriend/:id",checkLoginOrNot,addFriend);
userRoutes.put("/unFriend/:id",checkLoginOrNot,unFriend);
userRoutes.get("/friendList/:id",checkLoginOrNot,friendList);
userRoutes.get("/AlluserList",checkLoginOrNot,AlluserList);


module.exports = userRoutes

