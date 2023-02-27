const express = require("express");
const postRoutes = express.Router();
const { checkLoginOrNot } = require("../middleware/auth");
const { update,
        deletePost,
        likePost, 
        getPost,
        timelinePosts,
        userAllPosts,
        addProfilePicture,
        addPosts,
        descriptionPost} = require("../controllers/post")

postRoutes.post("/addProfilePicture",checkLoginOrNot,addProfilePicture)
postRoutes.post("/addPosts",checkLoginOrNot,addPosts)
postRoutes.post("/descriptionPost",checkLoginOrNot,descriptionPost)
postRoutes.get("/:id/update",checkLoginOrNot,update)
postRoutes.delete("/delete/:id",checkLoginOrNot,deletePost)
postRoutes.put("/LikePost/:id",checkLoginOrNot,likePost)
postRoutes.get("/:id/getPost",checkLoginOrNot,getPost)
postRoutes.get("/timelinePosts",checkLoginOrNot,timelinePosts)
postRoutes.get("/userAllPosts",checkLoginOrNot,userAllPosts)

module.exports = postRoutes;