import "./share.css";
import { PermMedia, Label, Room, EmojiEmotions } from "@mui/icons-material";
import { useRef, useContext, useState } from "react";
import Authcontext from "../../context/Authcontext";
import axios from "axios";
import { CircularProgress } from "@mui/material";

export default function Share() {
  let nextId = 0;
  const { data } = useContext(Authcontext);
  
  const [images, setImages] = useState([]);
  const [imageUplaodStatus, setImageUploadStatus] = useState(0);

  const description = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const postwithDesc = {
      desc: description.current.value,
    };

    if (!images.length && postwithDesc) {
      setImageUploadStatus(1);
      try {
        const res = await axios.post(
          `/api/posts/descriptionPost`,
          postwithDesc
        );
        setImageUploadStatus(0);
        description.current.value = ''
        console.log("dsadasdasdasdasdas",description.current.value);
      } catch (error) {
        console.log(error.message);
        window.alert("Post cant be uploaded");
        setImageUploadStatus(0);

      }
    }

    if (images.length) {
      setImageUploadStatus(1);

      const formData = new FormData();
      images.map((image) => formData.append("photos", image.inputimage));

      try {
        const res = await axios.post(`/api/posts/addPosts`, formData, {
          headers: {
            "content-type": "multipart/form-data",
          },
        });
     
        if (postwithDesc.desc && res.status === 200) {
          const imageID = res.data.product._id

          postwithDesc.imageID = imageID
          const res2 = await axios.post(
            `/api/posts/descriptionPost`,
            postwithDesc
            );
          
            if(res2){
              description.current.value = ''
            }
          }
          setImageUploadStatus(0);
          console.log(description);
      } catch (error) {
        console.log(error.message);
        if (error.message) {
          setImageUploadStatus(0);
         
          window.alert("image cant be uploaded");
        }
      }
    }
  };

  const handleOnChange = (e) => {
    console.log(e.target.files);
    setImages([...images, { id: nextId++, inputimage: e.target.files[0] }]);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="share">
        <div className="shareWrapper">
          <div className="shareTop">
          
            <img
              className="shareProfileImg"
              src={data.user.profilePicture
                  ? data.user.profilePicture.secure_url
                  : require("../../assets/white_profile_picture.png")
              }
              alt=""
            />
            <input
              placeholder={`What's in your mind ${
                data ? data.user.username : ""
              }?`}
              className="shareInput"
              ref={description}
            />
          </div>

          <hr className="shareHr" />
          <div className="shareBottom">
            <div className="shareOptions">
              <label htmlFor="file" className="shareOption">
                <PermMedia htmlColor="tomato" className="shareIcon" />
                <span className="shareOptionText">Photo or Video</span>
                <input
                  style={{ display: "none" }}
                  type="file"
                  id="file"
                  accept=".png,.jpeg,.jpg"
                  onChange={handleOnChange}
                />
              </label>
              <div className="shareOption">
                <Label htmlColor="blue" className="shareIcon" />
                <span className="shareOptionText">Tag</span>
              </div>
              <div className="shareOption">
                <Room htmlColor="green" className="shareIcon" />
                <span className="shareOptionText">Location</span>
              </div>
              <div className="shareOption">
                <EmojiEmotions htmlColor="goldenrod" className="shareIcon" />
                <span className="shareOptionText">Feelings</span>
              </div>
            </div>
            <button type="submit" className="shareButton">
              {imageUplaodStatus ? <CircularProgress /> : "Share"}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
