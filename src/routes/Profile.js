import { signOut } from "firebase/auth";
import React from "react";
import { authService } from "../myBase";

const Profile = () => {
  const onsignOut = () => {
    signOut(authService);
  };
  return (
    <>
      <button onClick={onsignOut}>Log-Out</button>
    </>
  );
};

export default Profile;
