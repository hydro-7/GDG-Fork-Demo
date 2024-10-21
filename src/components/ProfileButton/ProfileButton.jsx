import React, { useState } from "react";
import { useAuthContext } from "../../contexts/auth";
import { useUserContext } from "../../contexts/user";
import { Link } from "react-router-dom";

import "./ProfileButton.css";

import {
  RiArrowDownSLine,
  RiArrowUpSLine,
  RiLogoutCircleLine,
  RiSettings3Fill,
  RiNotification4Fill,
} from "@remixicon/react";
import { capitalizeFirstLetter } from "../../utils/stringFunctions";
import { useTheme } from "../../contexts/theme";

function ProfileButton() {
  const { theme, toggleTheme } = useTheme();
  const { userData } = useUserContext();
  const { logout } = useAuthContext();

  const [menuVisible, setMenuVisible] = useState(false);

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  if (!userData) {
    return null;
  }

  return (
    <div id="Profile-dropdown" className={`nav-${theme}`}>
      <div className="nav-account" onClick={toggleMenu}>
        <img src={userData?.profile_image_url} alt="" className="dp" />
        <div className="acc-details">
          <p className="acc-name">
            {capitalizeFirstLetter(userData?.full_name)}
          </p>
          <p className="acc-email">@{userData?.username}</p>
        </div>
        {menuVisible ? (
          <RiArrowUpSLine color="#727272" />
        ) : (
          <RiArrowDownSLine color="#727272" />
        )}
      </div>
      {menuVisible && (
        <div className="profile-menu">
          <Link
            className="profile-dd-link"
            onClick={toggleMenu}
            to={"/playground/dashboard"}
          >
            Dashboard
          </Link>
          <Link
            className="profile-dd-link"
            onClick={toggleMenu}
            to={"/playground/settings"}
          >
            <RiNotification4Fill />
            Notifications
          </Link>
          <button className="theme-btn" onClick={toggleTheme}>
            Change Mode
          </button>
          <button className="logout-btn" onClick={logout}>
            <RiLogoutCircleLine />
            Logout
          </button>
        </div>
      )}
    </div>
  );
}

export default ProfileButton;