import { signOut, updateProfile } from "firebase/auth";
import {
  collection,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import {
  deleteObject,
  getDownloadURL,
  getStorage,
  ref,
  uploadString,
} from "firebase/storage";
import React, { useEffect, useRef, useState } from "react";
import { authService, dbService } from "../myBase";
import { v4 as uuidv4 } from "uuid";
import Dweet from "../components/Dweet";

const Profile = ({ userObj, userUpdate }) => {
  const [userDwit, setUserDwit] = useState([]);
  const [editProfile, setEditProfile] = useState(false);
  const [userDisplayName, setUserDisplayName] = useState(userObj.displayName);
  const [userPhoto, setUserPhoto] = useState("");
  const photoFile = useRef();
  const toggleEdit = () => {
    setEditProfile((current) => !current);
    clearFile();
  };
  const onChange = (event) => {
    setUserDisplayName(event.target.value);
  };
  const onSubmit = async (event) => {
    event.preventDefault();
    let PhotoUrl = "";

    if (userPhoto !== "") {
      const storage = getStorage();
      if (userObj.photoURL) {
        if (
          userObj.photoURL.split(".")[1] !== "googleusercontent" &&
          userObj.photoURL.split(".")[1] !== "githubusercontent"
        ) {
          const deleteRef = ref(storage, userObj.photoURL);
          await deleteObject(deleteRef).catch(() => {
            console.log("기존이미지가 firebase에 없는 경우");
          });
        }
      }
      const userPhotoRef = ref(storage, `${userObj.uid}/${uuidv4()}`);
      await uploadString(userPhotoRef, userPhoto, "data_url");
      PhotoUrl = await getDownloadURL(userPhotoRef);
    }

    if (userObj.displayName !== userDisplayName || userPhoto !== "") {
      await updateProfile(authService.currentUser, {
        displayName: `${userDisplayName}`,
        photoURL: PhotoUrl === "" ? userObj.photoURL : PhotoUrl,
      });
      userUpdate();
      toggleEdit();
      clearFile();
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
    const userDwitData = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setUserDwit(userDwitData);
  };
  useEffect(() => {
    getMyDwieets();
  }, []);

  const clearFile = () => {
    if (userPhoto) {
      setUserPhoto("");
      photoFile.current.value = null;
    }
  };
  useEffect(() => newsnap(), []);
  const newsnap = () => {
    const q = query(
      collection(dbService, "Dwieet"),
      where("creatorId", "==", userObj.uid),
      orderBy("createAt", "desc")
    );
    onSnapshot(q, (snap) => {
      const mydiwtsArry = snap.docs.map((item) => ({
        id: item.id,
        ...item.data(),
      }));
      setUserDwit(mydiwtsArry);
    });
  };

  return (
    <>
      <div className="proFile-Btnbox">
        <button onClick={toggleEdit}>Edit-Profile</button>
        <button onClick={onsignOut}>Log-Out</button>
      </div>
      <div>
        {editProfile ? (
          <form onSubmit={onSubmit} className="factoryForm profileForm">
            <label htmlFor="profile-displayName">DisplayName(사용자이름)</label>
            <input
              id="profile-displayName"
              type="text"
              placeholder="displayName"
              value={userDisplayName ? userDisplayName : ""}
              onChange={onChange}
              className="factoryInput profileEditInput"
            />
            <label htmlFor="Profile-File">
              <span className="factoryLabelBtn">프로필 이미지 변경</span>
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={onFileChange}
              ref={photoFile}
              id="Profile-File"
              className="factoryFile"
            />
            <div className="profile-edit-imgbox">
              {userPhoto ? <img src={userPhoto} alt="Null" /> : null}
              <input
                type="submit"
                value="Confirm"
                className="profile-edit-btn"
              />
              <button onClick={toggleEdit} className="profile-edit-btn">
                Cancel
              </button>
            </div>
          </form>
        ) : null}
      </div>
      <div className="profile-mainPhoto">
        <img
          src={userObj.photoURL ? userObj.photoURL : null}
          alt="프사를 추가해보세요"
        />
      </div>
      <>
        <div className="diwtsBigBox">
          {userDwit.map((item, index) => (
            <Dweet
              key={item.id}
              dwits={item}
              isOwner={userObj.uid === item.creatorId}
            />
          ))}
        </div>
      </>
      {/*       <div className="dwitBox">
        <div className="dwitText-Edit-Delete-Box">
          {userDwit.map((diwt, index) => (
            <h3 key={index}>{diwt.text} </h3>
          ))}
        </div>
      </div> */}
    </>
  );
};

export default Profile;
