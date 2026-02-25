import React from "react";

const ViewFeatures = ({ initialData }) => {
    // Normalize features (array | string → array)
    const features = Array.isArray(initialData?.features)
        ? initialData.features
        : typeof initialData?.features === "string"
            ? initialData.features.replace(/[\[\]'"]/g, "").split(",")
            : [];

    return (
        <div
            className="modal fade features-popup-modal"
            id="featuresPopupModal"
            tabIndex="-1"
            aria-labelledby="featuresPopupLabel"
            aria-hidden="true"
        >
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content features-popup-content">
                    <div className="modal-header subscription-header">
                        <h5 className="modal-title" id="featuresPopupLabel">
                            {initialData?.plan_name || "Plan"} Features
                        </h5>
                        <img
                            src="./images/cross-dropdown.svg"
                            className="cross-dropdown"
                            style={{ cursor: "pointer" }}
                            data-bs-dismiss="modal"
                            aria-label="Close"
                        />
                    </div>

                    <div className="modal-body features-popup-body">
                        <p className="features">Features</p>

                        {features.length > 0 ? (
                            <ul className="features-list">
                                {features.map((feature, index) => (
                                    <li key={index}>{feature.trim()}</li>
                                ))}
                            </ul>
                        ) : (
                            <p className="no-features">No features available</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewFeatures;