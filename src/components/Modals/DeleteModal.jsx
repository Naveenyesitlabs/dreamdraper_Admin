import React from 'react'

const DeleteModal = ({ onConfirm, onClose, type }) => {
  return (
    <div
      className="modal fade"
      id="deleteDesign"
      tabIndex="-1"
      aria-hidden="true">
      <div
        className="modal-dialog modal-dialog-centered delete-design-overlay">

        <div className="modal-content delete-design-popup">

          <img src="./images/cross-icon.svg"
            className="cross-icon"
            data-bs-dismiss="modal"
            style={{ cursor: "pointer" }}
            onClick={onClose}
          />

          <img src="./images/dust.svg"
            className="warning"
          />
          <p className="suspend-heading">
            Delete
          </p>
          <p className="suspend-text">
            {`Are you sure you want to delete this ${type}?`}
          </p>
          <div className="delete-buttons">
            <button className="delete-yes"
              data-bs-dismiss="modal"
              onClick={onConfirm}
            >
              Yes
            </button>
            <button className="delete-no"
            
              data-bs-dismiss="modal" onClick={onClose}>
              No
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DeleteModal
