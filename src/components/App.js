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
        setUserObj(user);
      }
    });
    setInit(true);
  }, []);
  return (
    <div className="App">
      {init ? (
        <AppRouter loggedIn={Boolean(userObj)} userObj={userObj} />
      ) : (
        <h1>Initializing...</h1>
      )}
    </div>
  );
}

export default App;
