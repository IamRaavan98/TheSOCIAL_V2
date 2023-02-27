import { useEffect, useState } from "react";
import axios from "axios";
import Share from "../share/Share";
import Post from "../post/Post";
import "./feed.css";


export default function Feed({ username, _id }) {
  
  // console.log("username",username);
  const [posts, setPosts] = useState([]);
  const [postsforProfile, setPostsForProfile] = useState([]);

  useEffect(() => {
    fetchtimelinePosts();
  }, [username]);



  const fetchtimelinePosts = async () => {
    try {
      axios.defaults.withCredentials = true;

      if (!username) {
        const res = await axios.get(`/api/posts/timelinePosts`);
        // console.log(res);
        // console.log(res);
        setPosts(res.data);
        setPosts(
          res.data.sort((p1, p2) => {
            return new Date(p2[0]&&p2[0].createdAt) - new Date(p1[0]&&p1[0].createdAt);
          })
        );

    


      } else {
        const res = await axios.get(
          `/api/posts/userAllPosts?username=${username}&_id=${_id}`
        );
   
        if (res.data.message) {
          //we are sending data inside []array as when timeline post work it have array of array as one user its all photos then another user its photos.. but here we only have one user photos so our post component is made in such a way that it handle arrays of arrays
        setPosts([
            res.data.message.sort((p1, p2) => {
              return new Date(p2.createdAt) - new Date(p1.createdAt);
            })]
          );
          
         
        }
      }
    } catch (error) {
       console.log(error.message);
       console.log(error.response.data);
      
    
    }
  };
  return (
    <div className="feed mr-4">
      <div className="feedwrapper">
        
        {/* only login user can share a post and if go to friends profile we should not be able to upload photos */}
     
        {username ? "" : <Share />}
        {posts &&
          posts.map((p) => (
            p.length>0?
            <Post  fetchtimelinePosts={fetchtimelinePosts} key={p[0]._id} post={p} />
            :(" ")
          ))}
      </div>
     
    </div>
  );
}
