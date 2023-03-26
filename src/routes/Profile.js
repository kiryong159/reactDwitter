import { signOut, updateProfile } from "firebase/auth";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import {
  deleteObject,
  getDownloadURL,
  getStorage,
  ref,
  uploadString,
} from "firebase/storage";
import React, { useEffect, useState } from "react";
import { authService, dbService } from "../myBase";
import { v4 as uuidv4 } from "uuid";

const Profile = ({ userObj }) => {
  const [userDwit, setUserDwit] = useState([]);
  const [editProfile, setEditProfile] = useState(false);
  const [userDisplayName, setUserDisplayName] = useState(userObj.displayName);
  const [userPhoto, setUserPhoto] = useState("");
  const toggleEdit = () => {
    setEditProfile((current) => !current);
  };
  const onChange = (event) => {
    setUserDisplayName(event.target.value);
  };
  const onSubmit = async (event) => {
    event.preventDefault();
    let PhotoUrl = "";

    if (userPhoto !== "") {
      const storage = getStorage();
      const deleteRef = ref(storage, userObj.photoURL);
      if (userObj.photoURL) {
        const photoDelete = await deleteObject(deleteRef).catch(() => {
          console.log("기존이미지가 firebase에 없는 경우");
        });
      }
      const userPhotoRef = ref(storage, `${userObj.uid}/${uuidv4()}`);
      await uploadString(userPhotoRef, userPhoto, "data_url");
      PhotoUrl = await getDownloadURL(userPhotoRef);
    }

    if (userObj.displayName !== userDisplayName || userPhoto !== "") {
      await updateProfile(authService.currentUser, {
        displayName: `${userDisplayName}`,
        photoURL: PhotoUrl,
      });
    }
  };

  const onFileChange = (event) => {
    const userPhoto = event.target.files[0];
    if (userPhoto) {
      const reader = new FileReader();
      reader.onloadend = (finishEvent) =>
        setUserPhoto(finishEvent.target.result);
      reader.readAsDataURL(userPhoto);
    }
  };

  const onsignOut = () => {
    signOut(authService);
  };
  const getMyDwieets = async () => {
    const q = query(
      collection(dbService, "Dwieet"),
      where("creatorId", "==", userObj.uid),
      orderBy("createAt", "desc")
    );
    const querySnapshot = await getDocs(q);
    // querySnapshot.forEach((doc) => console.log(doc.id, "=>", doc.data()));
    //console.log(querySnapshot.docs.map((doc) => doc.data()));
    setUserDwit(querySnapshot.docs.map((doc) => doc.data()));
  };
  useEffect(() => {
    getMyDwieets();
  }, []);
  return (
    <>
      <button onClick={onsignOut}>Log-Out</button>
      <button onClick={toggleEdit}>Edit-Profile</button>
      <div>
        {editProfile ? (
          <form onSubmit={onSubmit}>
            <input
              type="text"
              placeholder="displayName"
              value={userDisplayName ? userDisplayName : ""}
              onChange={onChange}
            />
            <input type="file" accept="image/*" onChange={onFileChange} />
            <input type="submit" value="Confirm" />
            <button onClick={toggleEdit}>Cancel</button>
          </form>
        ) : null}
      </div>
      <div>
        <img
          src={userObj.photoURL ? userObj.photoURL : null}
          width="50px"
          height="50px"
        />
      </div>
      <div>
        {userDwit.map((diwt, index) => (
          <li key={index}>{diwt.text} </li>
        ))}
      </div>
    </>
  );
};

export default Profile;
