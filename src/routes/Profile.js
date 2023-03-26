import { signOut } from "firebase/auth";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import React, { useEffect } from "react";
import { authService, dbService } from "../myBase";

const Profile = ({ userObj }) => {
  const onsignOut = () => {
    signOut(authService);
  };
  const getMyDwieets = async () => {
    const q = await query(
      collection(dbService, "Dwieet"),
      where("creatorId", "==", userObj.uid),
      orderBy("createAt", "desc")
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => console.log(doc.id, "=>", doc.data()));
    console.log(querySnapshot.docs.map((doc) => doc.data()));
  };

  useEffect(() => {
    getMyDwieets();
  }, []);
  return (
    <>
      <button onClick={onsignOut}>Log-Out</button>
    </>
  );
};

export default Profile;
