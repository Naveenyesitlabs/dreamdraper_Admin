import React from 'react'

const ActiveAndInActiveModal = ({ onClose, onConfirm, item, type }) => {
    console.log("is_active", item)  
    return (
        <div className="modal fade" id="activateTemplateModal" tabIndex="-1" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered activeDesignOverlay">
                <div className="modal-content activate-popup-box">
                    <button type="button" className="activate-close-btn"
                        data-bs-dismiss="modal"><img src="./images/cross-icon.svg"
                            style={{
                                right: '-14px',
                                top: '-48px',
                                cursor: 'pointer'
                            }}
                            className="cross-icon" data-bs-dismiss="modal"
                            onClick={() => onClose()}
                        /></button>
                    {item?.is_active == 1 ? <img src="./images/inactive.svg" className="warning" /> : <img src="./images/active.svg" className="warning" />}

                    {/* <h5 className="activate-popup-title">Active</h5> */}
                    <h5 className="activate-popup-title">{item?.is_active == 1 ? "Suspend" : "Activate"}</h5>
                    <p className="activate-popup-text">{`Are you sure you want to ${item?.is_active == 1 ? "Suspend" : "Activate"} this ${type}?`}</p>
                    {/* <p className="activate-popup-text">Are you sure you want to activate this template?</p> */}
                    <div className="activate-popup-buttons">
                        <button className="activate-btn-yes" data-bs-dismiss="modal" onClick={onConfirm}>Yes</button>
                        <button className="activate-btn-no" data-bs-dismiss="modal" onClick={() => onClose()}>No</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ActiveAndInActiveModal
