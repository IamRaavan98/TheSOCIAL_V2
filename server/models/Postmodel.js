const mongoose = require("mongoose");

const PostSchmea = new mongoose.Schema(
    {
     userid:{
        type:String,
        required:true,
        default:" ",
     },
     description:{
        type:String,
        max:500,
        default:" ",
     },
     img:{
        id:String,
        secure_url:String,
     },
     likes:{
        type:Array,
        default:[]
     },
    },
  { timestamps: true }
);

module.exports = mongoose.model("Postmodel", PostSchmea);
