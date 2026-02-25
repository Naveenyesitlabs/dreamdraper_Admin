import React from "react";
import { useSidebar } from "../hooks/SidebarContext";

export default function Navbar() {
  const { toggleSidebar } = useSidebar();
  const handlelogout = () => {
    localStorage.removeItem('dreamDrapperAminToken');
    window.location.href = "/"
  }

  return (
    <>
      <div className="navbar">
        <div className="left">
          <img src="./images/logo.svg" className="logoDream" />
          <img className="hamburger" id="hamburger" src="./images/ham.svg" style={{
            display: 'inline'
          }} onClick={toggleSidebar} />
        </div>
        <div className="right">
          <img src="./images/profile.svg" className="profileIcon" style={{
            cursor: 'pointer'
          }} />
          <img src="./images/logout.svg" className="logoutIcon" onClick={handlelogout} style={{
            cursor: 'pointer'
          }} />
        </div>
      </div>
    </>
  );
}
