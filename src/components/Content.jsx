import React from "react";
import TableSection from "./TableSection";

export default function Content() {
  return (
    <div className="content">
      <div className="main-content">
        <div className="header-button">
          <div>
            <h2 className="heading-content">Category Manager</h2>
            <p className="text-content">Manage your DreamDraper platform</p>
          </div>
          <button className="back-btn">
            <img src="/images/btn-back.svg" className="arrow-back" /> Back
          </button>
        </div>

        <TableSection />
      </div>
    </div>
  );
}
