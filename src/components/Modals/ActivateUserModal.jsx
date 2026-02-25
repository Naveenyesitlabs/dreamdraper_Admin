import React from "react";

export function ActivateModal({ onClose, onConfirm, User }) {
  return (
    <div
      className="activate-user-overlay"
      id="activate"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div className="activate-popup">
        {/* Close button */}
        <img
          src="/images/cross-icon.svg"
          className="cross-icon"
          alt="Close"
          onClick={onClose}
          style={{ cursor: "pointer" }}
        />
        {User.is_active == 1 ? <img src="./images/warning.svg" className="warning" /> : <img src="/images/activateUser.svg" className="delete-icon" alt="Activate" />}
        <h2 className="delete-text">{User.is_active == 1 ? "Suspend" : "Activate"}</h2>
        <p className="delete-para">{`Are you sure you want to ${User.is_active == 1 ? "Suspend" : "Activate"} this user?`}</p>

        <div className="delete-buttons">
          <button className="delete-yes" onClick={() => onConfirm(User.id)}>
            Yes
          </button>
          <button className="delete-no" onClick={onClose}>
            No
          </button>
        </div>
      </div>
    </div>
  );
}