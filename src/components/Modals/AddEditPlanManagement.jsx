import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const AddEditPlanManagement = ({ initialData = null, onSubmit }) => {
    const isEdit = Boolean(initialData);

    const initialValues = {
        plan_name: initialData?.plan_name || "",
        features: initialData?.features
            ? Array.isArray(initialData.features)
                ? initialData.features.join(", ")
                : initialData.features.toString()
            : "",
        duraction: initialData?.duraction || "",
        price: initialData?.price || "",
        is_active: initialData
            ? Boolean(Number(initialData?.is_active))
            : true,
    };

    const validationSchema = Yup.object({
        plan_name: Yup.string().required("Plan name is required"),
        features: Yup.string().required("Features are required"),
        duraction: Yup.string().required("Duration is required"),
        price: Yup.number()
            .typeError("Price must be a number")
            .min(0, "Price cannot be negative")
            .required("Price is required"),
    });

    const handleSubmit = (values, { resetForm }) => {
        const payload = {
            ...values,
            features: values.features
                ? values.features.split(",").map(f => f.trim())
                : [],
            is_active: values.is_active ? 1 : 0,
            ...(isEdit && { id: initialData.id }),
        };
        onSubmit(payload);
        if (!isEdit) resetForm();
    };



    const errorStyle = {
        color: "red",
        fontSize: "12px",
        marginTop: "4px",
    };

    return (
        <div className="modal fade" id="addplan" tabIndex="-1" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered modal-lg" style={{ width: "462px" }}>
                <div className="modal-content upload-template-popup">
                    <div className="modal-header upload-header">
                        <label className="modal-heading">
                            {isEdit ? "Edit Plan" : "Create New Plan"}
                        </label>
                        <img
                            src="./images/cross-dropdown.svg"
                            className="cross-dropdown"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                            style={{ cursor: "pointer" }}
                        />
                    </div>

                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                        enableReinitialize
                    >
                        {({ values }) => (
                            <Form className="upload-dropdowns">

                                {/* Plan Name */}
                                <div>
                                    <p className="upload-content-heading">Plan Name</p>
                                    <Field
                                        name="plan_name"
                                        type="text"
                                        placeholder="e.g. Pro Plan"
                                        className="upload-content-input"
                                    />
                                    <ErrorMessage name="plan_name" render={(msg) => <div style={errorStyle}>{msg}</div>} />
                                </div>

                                {/* Features */}
                                <div>
                                    <p className="upload-content-heading">Features</p>
                                    <Field
                                        as="textarea"
                                        name="features"
                                        placeholder="Enter features separated by commas"
                                        className="upload-content-textarea"
                                    />
                                    <ErrorMessage name="features" render={(msg) => <div style={errorStyle}>{msg}</div>} />
                                </div>

                                {/* Duration */}
                                <div>
                                    <p className="upload-content-heading">Plan Duration</p>
                                    <Field as="select" name="duraction" className="upload-content-input">
                                        <option value="" disabled>
                                            Select Duration
                                        </option>
                                        {/* <option value="quarter">Quarterly</option> */}
                                        <option value="monthly">Monthly</option>
                                        <option value="yearly">Yearly</option>
                                    </Field>
                                    <ErrorMessage name="duration" render={(msg) => <div style={errorStyle}>{msg}</div>} />
                                </div>

                                {/* Price */}
                                <div>
                                    <p className="upload-content-heading">Monthly Price ($)</p>
                                    <Field
                                        name="price"
                                        type="number"
                                        placeholder="0"
                                        className="number-input"
                                    />
                                    <ErrorMessage name="price" render={(msg) => <div style={errorStyle}>{msg}</div>} />
                                </div>

                                {/* Active Toggle */}
                                <div className="active-plan">
                                    <div>
                                        <p className="upload-content-heading" style={{ marginBottom: "10px" }}>
                                            Active Plan
                                        </p>
                                        <p className="active-text">
                                            Make this plan available for subscription
                                        </p>
                                    </div>

                                    <label className="switch">
                                        <Field type="checkbox" name="is_active" />
                                        <span className="slider"></span>
                                    </label>
                                </div>

                                {/* Buttons */}
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "flex-end",
                                        gap: "10px",
                                    }}
                                >
                                    <button
                                        type="button"
                                        className="uploadCancel"
                                        data-bs-dismiss="modal"
                                    >
                                        Cancel
                                    </button>
                                    <button type="submit" className="uploadSubmit" data-bs-dismiss="modal">
                                        {isEdit ? "Update" : "Submit"}
                                    </button>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>
        </div>
    );
};

export default AddEditPlanManagement;