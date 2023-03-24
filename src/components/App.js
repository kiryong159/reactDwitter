import AppRouter from "./Router";
import React, { useEffect, useState } from "react";
import { authService } from "../myBase";
import { onAuthStateChanged } from "firebase/auth";

function App() {
  const [init, setInit] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [userObj, setUserObj] = useState(null);
  useEffect(() => {
    onAuthStateChanged(authService, (user) => {
      if (user) {
        setLoggedIn(true);
        setUserObj(user);
      } else setLoggedIn(false);
    });
    setInit(true);
  }, []);
  return (
    <div className="App">
      {init ? (
        <AppRouter loggedIn={loggedIn} userObj={userObj} />
      ) : (
        <h1>Initializing...</h1>
      )}
    </div>
  );
}

export default App;
