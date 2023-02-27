import { MoreVert } from "@mui/icons-material";
import { useState,useEffect, useContext} from "react";
import "./post.css";
import axios from "axios";
import { Link } from "react-router-dom";
import { useRef } from "react";
import Authcontext from "../../context/Authcontext";



export default function Post({fetchtimelinePosts, post}) {
  const inputOne = useRef()
  const [like, setLike] = useState(post.like);
  const [isLiked, setIsLiked] = useState(false);
  const [followingPost, setFollowingPost] = useState()

  // like or dislike
  const likeHandler =async (Post) => {   
     try {
      const res = await axios.put(`/api/posts/likePost/${Post._id}`)
          if(res.data === "You have like the post"){
               
          }
          else if(res.data === "You have unlike the post"){
           
          }      
       fetchtimelinePosts();
     } catch (error) {
      console.log(error.message);
      console.log(error.response.data);
     }
  };
 

  const Allfollowingsdata = async () => {
    if(post.length){
     try {
      if(post[0].userid){
   
        const res = await axios.get(`api/users/getUser/${post[0].userid}`);

       if(res){
        // console.log("from psot getuser",res.data);
         setFollowingPost(res.data)
        }
      }
      } catch (error) {
      console.log(error.message)
     }
    }
  };

const {data} = useContext(Authcontext)
  
  useEffect(() => {
    Allfollowingsdata();
  },[]);
  
 
  const handlePostDelete = async(post) => {
  try {
    console.log(post._id);
    if(!post._id){
      return 
    }
    const res = await axios.delete(`/api/posts/delete/${post._id}`)

    fetchtimelinePosts()
    
    
  } catch (error) {
    console.log(error.message);
  }
  }

  
  return (
    <>
    
      {post &&
        post.map((post) => (
          <div className="post" key={post._id}>
           
            <div className="postWrapper">
              <div  className="postTop">
             
                <div  className="postTopLeft">
   
                       
                  <Link  to={`/profile?username=${followingPost&&followingPost.username}&_id=${followingPost&&followingPost._id}`}>

                  <div className=" flex flex-row align-center">
                  <img
                    className="postProfileImg"
                      src={followingPost&&followingPost.profilePicture.secure_url?(followingPost.profilePicture.secure_url):(require('../../assets/white_profile_picture.png'))}
                    alt=""
                  />
                  <span className="postUsername">
                    {followingPost&&followingPost.username}
                  </span>
                  </div>

                  </Link>
                  <span  key={post._id} className="postDate">{post.createdAt.slice(11,19)} on {(post.createdAt.slice(0,10))}</span>
                </div>
                <div  className="postTopRight flex flex-col">
                 
                 {data?data.user._id === post.userid?(
                 <div  className="">
                  <button onClick={()=>handlePostDelete(post)}
                  className=" "
                  >Delete</button>
                  </div> 
                 ):(''):('')}
              
                </div>
              </div>
              <div className="postCenter">
             
                <span  key={post._id} className="postText">{post.description?(post.description):(" ")}</span>
                <img   className="postImg" src={post.img&&post.img.secure_url} alt="" />
              </div>
             
              <div className="postBottom">
                <div className="postBottomLeft space-x-2">
                  <img
                    className="likeIcon"
                    src={require("../../assets/like.png")}
                    onClick={()=>likeHandler(post)}
                    width="25px"
                    alt=""
                  />
              

                  <span  key={post._id} className="postLikeCounter ">
                    {post.likes.length}
                  </span>
                </div>
                <div className="postBottomRight">
                  <span  key={post._id} className="postCommentText">
                    {post.comment} comments
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
    </>
  );
}
