import "./profile.css";
import Topbar from "../../components/topbar/Topbar";
import Sidebar from "../../components/sidebar/Sidebar";
import Feed from "../../components/feed/Feed";
import Rightbar from "../../components/rightbar/Rightbar";
import { useSearchParams } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { useEffect } from "react";

export default function Profile() {
  const [searchParams, setSearchParams] = useSearchParams();
  const username = searchParams.get("username");
  const _id = searchParams.get("_id");
  const [userinfo, setUserInfo] = useState();
  const getuserinfo = async () => {
    try {
      const id = _id;
      const res = await axios.get(`/api/users/getUser/${id}`);
      setUserInfo(res.data);

    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    getuserinfo();
  }, [username]);

  return (
    <>
      <Topbar />
      <div className="profile">
        <Sidebar />
        <div className="profileRight">
          <div className="profileRightTop">
            <div className="profileCover">
              
              {/* {console.log(userinfo && userinfo.hasOwnProperty('coverPicture'))} */}
              <img
                className="profileCoverImg"
                src={
                  userinfo&&userinfo.hasOwnProperty('coverPicture')&&
                  Object.keys(userinfo.coverPicture).length
                      ? userinfo.coverPicture.secure_url
                      :userinfo&&userinfo.hasOwnProperty('profilePicture')&& Object.keys(userinfo.profilePicture).length?userinfo.profilePicture.secure_url:('')
                }
                alt=""
              />

              <img
                className="profileUserImg"
                src={
                  userinfo &&userinfo.hasOwnProperty('profilePicture')
                    &&  Object.keys(userinfo.profilePicture).length
                      ? userinfo.profilePicture.secure_url
                      : require("../../assets/white_profile_picture.png")
                }
                alt=""
              />
            </div>
            <div className="profileInfo">
              <h4 className="profileInfoName">{username}</h4>
              <span className="profileInfoDesc">Hello my friends!</span>
            </div>
          </div>
          <div className="profileRightBottom">
            <Feed username={username} _id={_id} />
            <Rightbar getuserinfo={getuserinfo} userinfo={userinfo} setUserInfo = {setUserInfo} />
          </div>
        </div>
      </div>
    </>
  ); 
}
