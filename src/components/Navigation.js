import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse, faUser } from "@fortawesome/free-solid-svg-icons";

const Navigation = ({ userObj }) => {
  return (
    <nav className="navBox">
      <ul>
        <li className="li">
          <Link to="/">
            <FontAwesomeIcon icon={faHouse} />
            <span>Home</span>
          </Link>
        </li>
        <li className="li">
          <Link to="/profile">
            <FontAwesomeIcon icon={faUser} />
            <span>
              {userObj.displayName ? userObj.displayName : "Your "} Profile
            </span>
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
