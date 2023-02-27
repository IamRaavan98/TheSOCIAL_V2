const Postmodel = require("../models/Postmodel");
const cloudinary = require("cloudinary");
const Usermodel = require("../models/Usermodel");

// create a post
//
exports.addProfilePicture = async (req, res) => {
   
  if(!req.files){
    return res.status(404).send("Cant find images")
   }
  try {
    let result = await cloudinary.v2.uploader.upload(
      req.files.photos.tempFilePath,
      {
        folder: "usersprofile",
      }
    );
    if (result.public_id) {
      const user = await Usermodel.findById(req.user.id);
      if (!user) {
        // here if for any reason we didnt find the user we will delete that photo
        await cloudinary.v2.uploader.destroy(result.public_id);
        return res.status(400).send("user not found so image not uploaded");
      } else {

        if(user.profilePicture.id){
          //to delete current profile picture as we are uploading new profile picture
          await cloudinary.v2.uploader.destroy(user.profilePicture.id);
        }
        user.profilePicture.id = result.public_id;
        user.profilePicture.secure_url = result.secure_url;
        await user.save();
        console.log(user);
        res.status(200).json({
          success: true,
          user,
        });
      }
    } else {
      throw new Error("error in uploading image to cloudinary ");
    }
  } catch (error) {
    res.status(500).json(error.message);
  }
};

exports.addPosts = async (req, res, next) => {
  // images
  try {
    let imageArray = [];
    let product;
    if (!req.files) {
      throw new Error("Images are not found");
    }
    // console.log("RESULT", req.files.photos);
    // console.log(req.files.photos.tempFilePath);

    if (req.files) {
      for (let index = 0; index < req.files.photos.length; index++) {
        let result = await cloudinary.v2.uploader.upload(
          req.files.photos[index].tempFilePath,
          {
            folder: "users",
          }
        );

        // console.log("RESULT", result);
        imageArray.push({
          id: result.public_id,
          secure_url: result.secure_url,
        });
      }

      //only one image
      if (req.files.photos.length === undefined && req.files) {
        try {
          let result = await cloudinary.v2.uploader.upload(
            req.files.photos.tempFilePath,
            {
              folder: "users",
            }
          );
          imageArray.push({
            id: result.public_id,
            secure_url: result.secure_url,
          });
        } catch (error) {
          console.log("error", error);
          return res.status(401).send(error);
        }
      }

      for (let index = 0; index < imageArray.length; index++) {
        product = await Postmodel.create({
          userid: req.user.id,
          img: {
            id: imageArray[index].id,
            secure_url: imageArray[index].secure_url,
          },
        });
        // req.body.img = imageArray[index];
        // req.body.userid = req.user.id;
        // console.log("iam req.body ->",req.body);
        //  product = await Postmodel.create(req.body);
        // console.log("product",product);
      }

      res.status(200).json({
        success: true,
        product,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(400).send(error.message);
  }
};

exports.descriptionPost = async (req, res) => {
  const { desc, imageID } = req.body;
  if (!desc) {
    return res.status(400).send("Description not found");
  } else if (imageID) {
    try {
      const image = await Postmodel.findById({ _id: imageID });
      console.log("image", image);
      if (!image) {
        return res.status(404).send("the image is not uploaded");
      }
      image.description = desc;
      await image.save();
      return res.status(200).json({
        success: true,
      });
    } catch (error) {
      res.status(401).send(error.message);
    }
  } else {
    try {
      await Postmodel.create({
        userid: req.user.id,
        description: desc,
      });
      return res.status(200).json({
        success: true,
      });
    } catch (error) {
      res.status(404).send(error.message);
    }
  }
};

// update a post
//here the id which we are providing in params is of post id
exports.update = async (req, res) => {
  if (!req.body.description) {
    return res.status(404).send("please provide description");
  }
  const post = await Postmodel.findById(req.params.id);
  if (!post) {
    return res.status(404).send("post not found");
  }
  try {
    await post.updateOne({ $set: req.body });
    res.status(200).send("Post has been updated");
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// delete a post
//params id is of post you wanna delete
exports.deletePost = async (req, res) => {
  if (!req.params.id) {
    return res.status(404).send("post id not present in params");
  }

  const _id = req.params.id;
  const post = await Postmodel.findById(_id);

  if (!post) {
    return res.status(404).send("post not found");
  }

  try {
    if (post.img === null) {
      await cloudinary.v2.uploader.destroy(post.img.id);
    }
    await post.deleteOne();
    res.status(200).send("Post has been deleted");
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// like a post
// the id in params is of post a
// hm kisi dusre user ki bhi post ko search kr skte h by id in params
exports.likePost = async (req, res) => {
  try {
    const post = await Postmodel.findById(req.params.id);

    if (!post) {
      return res.status(400).send("post not found");
    }
    //we are using req.user._id beacuse kahi hamne pehle se post ko like toh nahi kr rakha
    if (!post.likes.includes(req.user._id)) {
      await post.updateOne({ $push: { likes: req.user._id } });
      return res.status(200).send("You have like the post");
    } else {
      await post.updateOne({ $pull: { likes: req.user._id } });
      return res.status(200).send("You have unlike the post");
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
//
// get a post
// here id in params is of a perticular post we want
exports.getPost = async (req, res) => {
  try {
    const post = await Postmodel.findById(req.params.id);
    if (post) {
      return res.status(200).json({
        success: true,
        message: post,
      });
    } else {
      return res.status(400).send("post not found");
    }
  } catch (error) {
    res.status(200).json({
      success: false,
      message: error.message,
    });
  }
};

// get timline posts
exports.timelinePosts = async (req, res) => {
 
  try {
    const currentUserPosts = await Postmodel.find({ userid: req.user._id });

    const friendPosts = await Promise.all(
      req.user.friends.map((friendsId) => {
        return Postmodel.find({ userid: friendsId });
      })
    );

    res.status(200).json(friendPosts);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//userAllPosts this gives the post of any user we clicked on and there id is sent through query
exports.userAllPosts = async (req, res) => {
  try {
    const { username, _id } = req.query;

    const currentUserPosts = await Postmodel.find({ userid: _id });

    if (currentUserPosts) {
      return res.status(200).json({
        success: true,
        message: currentUserPosts,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
