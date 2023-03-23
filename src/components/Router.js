import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Auth from "../routes/Auth";
import Home from "../routes/Home";

const AppRouter = ({ loggedIn }) => {
  return (
    <Router>
      <Routes>
        {loggedIn ? (
          <>
            <Route path="/" matchExactly element={<Home />} />
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
