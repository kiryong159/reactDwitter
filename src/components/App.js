import AppRouter from "./Router";
import React, { useEffect, useState } from "react";
import { authService } from "../myBase";
import { onAuthStateChanged } from "firebase/auth";

function App() {
  const [init, setInit] = useState(false);
  const [userObj, setUserObj] = useState(null);
  useEffect(() => {
    onAuthStateChanged(authService, (user) => {
      if (user) {
        setUserObj({
          displayName: user.displayName,
          photoURL: user.photoURL,
          uid: user.uid,
          email: user.email,
        });
      } else {
        setUserObj(null);
      }
    });
    setInit(true);
  }, []);
  const userUpdate = () => {
    const user = authService.currentUser;
    const photo = Boolean(authService.currentUser.photoURL !== null);
    setUserObj({
      displayName: user.displayName,
      photoURL: photo ? user.photoURL : null,
      uid: user.uid,
      email: user.email,
    });
  };
  return (
    <div className="App">
      {init ? (
        <AppRouter
          loggedIn={Boolean(userObj)}
          userObj={userObj}
          userUpdate={userUpdate}
        />
      ) : (
        <h1>Initializing...</h1>
      )}
    </div>
  );
}

export default App;
