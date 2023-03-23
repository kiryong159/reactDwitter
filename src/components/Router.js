import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Auth from "../routes/Auth";
import Home from "../routes/Home";
import Profile from "../routes/Profile";
import Navigation from "./Navigation";

const AppRouter = ({ loggedIn }) => {
  return (
    <Router>
      {loggedIn && <Navigation />}
      <Routes>
        {loggedIn ? (
          <>
            <Route path="/" matchExactly element={<Home />} />
            <Route path="/profile" matchExactly element={<Profile />} />
          </>
        ) : (
          <>
            <Route path="/" matchExactly element={<Auth />} />
          </>
        )}
      </Routes>
    </Router>
  );
};

export default AppRouter;
