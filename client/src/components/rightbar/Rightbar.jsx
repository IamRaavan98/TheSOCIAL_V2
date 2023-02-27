import "./rightbar.css";
import axios from "axios";
// import { Users } from "../../dummyData";
// import Online from "../online/Online";
import { useContext, useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Authcontext from "../../context/Authcontext";
// import { unFriend } from "../../../../server/controllers/user";



export default function Rightbar({ setUserInfo, userinfo,getuserinfo }) {
  // const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [friends, setFriends] = useState([]);

  const [searchParams, setSearchParams] = useSearchParams();
  const username = searchParams.get("username");
  const [followed,setFollowed] = useState()
  const _id = searchParams.get("_id");

  const loginuser = useContext(Authcontext);


  const handleAddFri = async ()=>{
    try {
      const res = await axios.put(`api/users/addFriend/${_id}`)
    
      if(res){
       setFollowed(true);
      }
    } catch (error) {
     console.log(error.message);
     console.log(error.response.data);
     
    }

 }
 
 const handleUnFri =async ()=>{
   try {
     const res = await axios.put(`api/users/unFriend/${_id}`)
  
     if(res){
      setFollowed(false);
     }
   } catch (error) {
    console.log(error.message);
    console.log(error.response.data);
   }
 }
 
  


  const getFriends = async () => {
    try {
      if (_id) {
        const friendList = await axios.get(`/api/users/friendList/${_id}`);
        setFriends(friendList.data);
        if(loginuser && loginuser.data.user._id !== _id){
          friendList.data.map((searchingForFriend)=>{
           
            if(loginuser.data.user._id === searchingForFriend._id){setFollowed(true); console.log("true");}
            else {setFollowed(false); console.log("true")}
          })
          console.log("iam working");

        }
      }
    } catch (err) {
      console.log(err.message);
    }
  };
  useEffect(() => {
    getFriends();
  }, [username]);

  const HomeRightbar = () => {
    return (
      <>
        <div className="birthdayContainer">
          <img className="birthdayImg" src="assets/gift.png" alt="" />
          <span className="birthdayText">
            <b>Pola Foster</b> and <b>3 other friends</b> have a birhday today.
          </span>
        </div>
        <img className="rightbarAd" src="assets/ad.png" alt="" />
        <h4 className="rightbarTitle">Online Friends</h4>
        {/* <ul className="rightbarFriendList">
          {friends.map((u) => (
            <Online key={u._id} user={u} />
          ))}
        </ul> */}
      </>
    );
  };

  const ProfileRightbar = () => {
    const [city, setCity] = useState();
    const [from, setFrom] = useState();
    const [relationship, setRelationship] = useState();
    const [edit, setEdit] = useState(false);    
    const cityFromRelationtoDB = async (e) => {
      e.preventDefault();
      setEdit(false);
      console.log(city);
      if (loginuser) {
         try {
          let res;
          if (city) {
             res = await axios.post(`/api/users/userUpdate`, {
              city,
            });
            
            console.log(res)
          } else if (from) {
             res = await axios.post(`/api/users/userUpdate`, {
              from,
            });
            console.log(res)
          } else if (relationship) {
            res = await axios.post(`/api/users/userUpdate`, {
              relationship,
            });
            console.log(res)
          }
          //so we props getuserInfo() from profile so that as we update city, from , relationship then it gets login user data from backend and update in userinfo             
          getuserinfo();
         } catch (error) {
          console.log(error.message);
         }
      }
      else {
        console.log(
          "trying to update city,relation,from but loginuser not present`"
        );
      }
    };

   
    return (
      <>

       
                {/* {console.log("userinfo", userinfo, "loginuser", loginuser)} */}
        { loginuser && userinfo ? (
          userinfo._id !== loginuser.data.user._id ? (
            <div>
           
              <h4 className="rightbarTitle">User information</h4>
              <div className="rightbarInfo">
                <div className="rightbarInfoItem">
                  <span className="rightbarInfoKey">City:</span>
                  <span key={userinfo._id}  className="rightbarInfoValue">
                    {userinfo.city ? userinfo.city : " "}
                  </span>
                </div>
                <div className="rightbarInfoItem">
                  <span className="rightbarInfoKey">From:</span>
                  <span key={userinfo._id}  className="rightbarInfoValue">
                    {userinfo.from ? userinfo.from : " "}
                  </span>
                </div>
                <div className="rightbarInfoItem">
                  <span className="rightbarInfoKey">Relationship:</span>
                  <span key={userinfo._id}  className="rightbarInfoValue">
                    {userinfo.Relationship ? userinfo.Relationship : " "}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            
            <div>
              <h4 className="rightbarTitle">User information</h4>
              <div className="rightbarInfo">
                <div className="rightbarInfoItem">
                  <form onSubmit={cityFromRelationtoDB}>
                    <label htmlFor="city">
                      <span className="rightbarInfoKey">City:</span>
                      {edit === "city" ? (
                        <>
                          <input
                            className="border-4"
                            id="city"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            type="text"
                          />
                          <button type="Submit">ok</button>
                        </>
                      ) : (
                        <span key={userinfo._id} >{userinfo.city}</span>
                      )}
                    </label>
                  </form>
                  <button onClick={() => setEdit("city")}>Edit</button>
                </div>

                <div className="rightbarInfoItem">
                  <form onSubmit={cityFromRelationtoDB}>
                    <label htmlFor="from">
                      <span className="rightbarInfoKey">From:</span>
                      {edit === "from" ? (
                        <>
                          <input
                            className="border-4"
                            id="from"
                            value={from}
                            onChange={(e) => setFrom(e.target.value)}
                            type="text"
                          />
                          <button type="Submit">ok</button>
                        </>
                      ) : (
                        <span key={userinfo._id} >{userinfo.from}</span>
                      )}
                    </label>
                  </form>
                  <button onClick={() => setEdit("from")}>Edit</button>
                </div>
                <div className="rightbarInfoItem">
                  <form onSubmit={cityFromRelationtoDB}>
                    <label htmlFor="Relationship">
                      <span className="rightbarInfoKey">Relationship:</span>
                      {edit === "relationship" ? (
                        <>
                          <select
                            value={relationship}
                            onChange={(e) => setRelationship(e.target.value)}
                            name="Relationship"
                            id="Relationship"
                          >
                            <option value="">none</option>
                            <option value="Single">Single</option>
                            <option value="Mingle">Mingle</option>
                          </select>
                          <button type="Submit">ok</button>
                        </>
                      ) : (
                        <>
                          <span key={userinfo._id} >{userinfo.relationship}</span>
                        </>
                      )}
                    </label>
                  </form>
                  <button onClick={() => setEdit("relationship")}>Edit</button>
                </div>
              </div>
            </div>
          )
        ) : (
          " "
        )}

        <h4 className="rightbarTitle">User friends</h4>
        <div className="rightbarFollowings">
          {friends &&
            friends.map((friend) => (
              <Link
              onClick={() => setUserInfo(friend)}
              to={`/profile?username=${
                friend.username && friend.username
              }&_id=${friend._id && friend._id}`}
              >
               
                {friend ? " " : <div>Why dont you search for SomeONE</div>}
                <div className="rightbarFollowing">
                  <img key={friend&&friend._id}
                    src={
                      friend
                        ? friend.profilePicture
                          ? friend.profilePicture.secure_url
                          : require("../../assets/white_profile_picture.png")
                        : require("../../assets/white_profile_picture.png")
                    }
                    alt=""
                    className="rightbarFollowingImg"
                  />
                  <span className="rightbarFollowingName">
                    {friend ? friend.username : " "}
                  </span>
                </div>
              </Link>
            ))}
        </div>
      </>
    );
  };
 
  return (
    <div className="rightbar">
      <div className="rightbarWrapper">
        {loginuser && loginuser.data.user._id !== _id?(
          <div>
          { followed?(
         <button className="rightbarFollowButton" onClick={handleUnFri}>Unfriend</button> 
         ):(
            <button className="rightbarFollowButton" onClick={handleAddFri}>Add friend</button> 
          )}
          </div>

        ):('')}
        {loginuser && (loginuser.data.user._id === _id || followed ) ? <ProfileRightbar /> : <HomeRightbar />}
      </div>
    </div>
  );
}
