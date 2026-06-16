// import { useEffect, useRef, useState } from 'react'
// import { Formik, Form, Field, ErrorMessage } from "formik";
// import * as Yup from "yup";
// import { useDispatch, useSelector } from 'react-redux'
// import { getPlans, } from '../../redux/admin/slices/planSlices'

// const AddEditPlanManagement = ({ initialData = null, onSubmit }) => {
//     const dispatch = useDispatch();
//     const hasFetched = useRef(false);
//     const isEdit = Boolean(initialData);
//     const { allPlans, loading } = useSelector((state) => state.plans);
//     const [plans, setPlans] = useState([]);
//     const [selectedPlanId, setSelectedPlanId] = useState(null);


//     // For select: only subscription plans (is_storeage = 0)
//     const selectablePlans = plans.filter(plan => plan.is_storeage == 0);

//     // For binding features: use full plans array
//     const allPlansForBinding = plans;
//     const subscriptionPlans = plans.filter(plan => plan.is_storeage == 0);
//     const storagePlans = plans.filter(plan => plan.is_storeage == 1);

//     useEffect(() => {
//         if (hasFetched.current) return;
//         hasFetched.current = true;
//         dispatch(getPlans())
//     }, [])

//     useEffect(() => {
//         if (allPlans) {
//             setPlans(allPlans)
//         }
//     }, [allPlans])

//     console.log("checkfeature__", storagePlans)
//     // const initialValues = {
//     //     plan_name: initialData?.plan_name || "",
//     //     features: initialData?.features
//     //         ? Array.isArray(initialData.features)
//     //             ? initialData.features.map(f => `• ${f}`).join("\n")  // Changed this line
//     //             : initialData.features.toString()
//     //         : "",
//     //     duraction: initialData?.duraction || "",
//     //     price: initialData?.price || "",
//     //     is_active: initialData
//     //         ? Boolean(Number(initialData?.is_active))
//     //         : true,
//     // };
//     // const initialValues = {
//     //     plan_id: initialData?.id || "", // important for editing
//     //     plan_name: initialData?.plan_name || "",
//     //     features: initialData?.features
//     //         ? Array.isArray(initialData.features)
//     //             ? initialData.features.map(f => `• ${f}`).join("\n")
//     //             : initialData.features.toString()
//     //         : "",
//     //     duraction: initialData?.duraction || "",
//     //     price: initialData?.price || "",
//     //     is_active: initialData ? Boolean(Number(initialData?.is_active)) : true,
//     // };

//     const initialValues = {
//         plan_id: initialData?.id || "",
//         plan_name: initialData?.plan_name || "",
//         features: initialData?.features
//             ? Array.isArray(initialData.features)
//                 ? initialData.features.map(f => `• ${f}`).join("\n")
//                 : initialData.features.toString()
//             : "",
//         duraction: initialData?.duraction || "",
//         price: initialData?.price || "",
//         is_active: initialData ? Boolean(Number(initialData?.is_active)) : true,
//     };
//     const validationSchema = Yup.object({
//         plan_name: Yup.string().required("Plan name is required"),
//         features: Yup.string().required("Features are required"),
//         duraction: Yup.string().required("Duration is required"),
//         price: Yup.number()
//             .typeError("Price must be a number")
//             .min(0, "Price cannot be negative")
//             .required("Price is required"),
//     });

//     const handleSubmit = (values, { resetForm }) => {
//         const payload = {
//             ...values,
//             // features: values.features
//             //     ? values.features.split(",").map(f => f.trim())
//             //     : [],
//             features: values.features
//                 ? values.features
//                     .split("\n")
//                     .map(f => f.replace(/^•\s*/, "").trim()) // remove bullet if present
//                     .filter(f => f !== "")
//                 : [],
//             is_active: values.is_active ? 1 : 0,
//             ...(isEdit && { id: initialData.id }),
//         };
//         onSubmit(payload);
//         if (!isEdit) resetForm();
//     };



//     const errorStyle = {
//         color: "red",
//         fontSize: "12px",
//         marginTop: "4px",
//     };

//     return (
//         <div className="modal fade" id="addplan" tabIndex="-1" aria-hidden="true">
//             <div className="modal-dialog modal-dialog-centered modal-lg" style={{ width: "462px" }}>
//                 <div className="modal-content upload-template-popup">
//                     <div className="modal-header upload-header">
//                         <label className="modal-heading">
//                             {isEdit ? "Edit Plan" : "Create New Plan"}
//                         </label>
//                         <img
//                             src="./images/cross-dropdown.svg"
//                             className="cross-dropdown"
//                             data-bs-dismiss="modal"
//                             aria-label="Close"
//                             style={{ cursor: "pointer" }}
//                         />
//                     </div>

//                     <Formik
//                         initialValues={initialValues}
//                         validationSchema={validationSchema}
//                         onSubmit={handleSubmit}
//                         enableReinitialize
//                     >
//                         {({ values, setFieldValue, handleChange }) => (
//                             <Form className="upload-dropdowns">

//                                 {/* Plan Name */}
//                                 <div>
//                                     <p className="upload-content-heading">Plan Name</p>
//                                     <Field
//                                         name="plan_name"
//                                         type="text"
//                                         placeholder="e.g. Pro Plan"
//                                         className="upload-content-input"
//                                     />
//                                     <ErrorMessage name="plan_name" render={(msg) => <div style={errorStyle}>{msg}</div>} />
//                                 </div>

//                                 {/* Features */}
//                                 <div>
//                                     <p className="upload-content-heading">Features</p>
//                                     <Field
//                                         as="textarea"
//                                         name="features"
//                                         placeholder="Enter features separated by commas"
//                                         className="upload-content-textarea"
//                                         disabled
//                                     />
//                                     <ErrorMessage name="features" render={(msg) => <div style={errorStyle}>{msg}</div>} />
//                                 </div>

//                                 {/* Duration */}
//                                 {/* <div>
//                                     <p className="upload-content-heading">Plan Duration</p>
//                                     <Field as="select" name="duraction" className="upload-content-input">
//                                         <option value="" disabled>
//                                             Select Duration
//                                         </option>

//                                         <option value="month">Monthly</option>
//                                         <option value="year">Yearly</option>
//                                     </Field>
//                                     <ErrorMessage name="duration" render={(msg) => <div style={errorStyle}>{msg}</div>} />
//                                 </div> */}
//                                 {/* Plan Select */}
//                                 <div>
//                                     <p className="upload-content-heading">Select Plan</p>

//                                     {/* <Field
//                                         as="select"
//                                         name="plan_id"
//                                         className="upload-content-input"
//                                         onChange={(e) => {
//                                             const selectedValue = e.target.value;
//                                             setSelectedPlanId(selectedValue)
//                                         }}
//                                     >
//                                         <option value="">Select Plan</option>

//                                         {storagePlans.map((plan) => (
//                                             <option key={plan.id} value={plan.id}>
//                                                 {plan.duraction}
//                                             </option>
//                                         ))}
//                                     </Field> */}
//                                     {/* <Field
//                                         as="select"
//                                         name="plan_id"
//                                         className="upload-content-input"
//                                         onChange={(e) => {
//                                             const selectedValue = e.target.value;
//                                             setSelectedPlanId(selectedValue);

//                                             const selectedPlan = storagePlans.find(
//                                                 (plan) => plan.id === Number(selectedValue)
//                                             );

//                                             if (selectedPlan) {
//                                                 const formattedFeatures = selectedPlan.features
//                                                     .map((f) => `• ${f}`)
//                                                     .join("\n");

//                                                 setFieldValue("features", formattedFeatures);
//                                                 setFieldValue("duraction", selectedPlan.duraction);
//                                             }
//                                         }}
//                                     >
//                                         <option value="">Select Plan</option>

//                                         {storagePlans.map((plan) => (
//                                             <option key={plan.id} value={plan.id}>
//                                                 {plan.duraction}
//                                             </option>
//                                         ))}
//                                     </Field> */}
//                                     {/* <Field
//                                         as="select"
//                                         name="plan_id"
//                                         className="upload-content-input"
//                                         onChange={(e) => {
//                                             const selectedId = Number(e.target.value);
//                                             setFieldValue("plan_id", selectedId);

//                                             // Find plan by id (exact match)
//                                             const selectedPlan = storagePlans.find(plan => plan.id === selectedId);

//                                             if (selectedPlan) {
//                                                 // Format features with bullets if exists
//                                                 const featureText = selectedPlan.features?.length
//                                                     ? selectedPlan.features.map(f => `• ${f}`).join("\n")
//                                                     : "";

//                                                 setFieldValue("features", featureText);
//                                                 setFieldValue("duraction", selectedPlan.duraction);
//                                                 setFieldValue("plan_name", selectedPlan.plan_name);
//                                                 setFieldValue("price", selectedPlan.price);
//                                             } else {
//                                                 // Clear if no plan selected
//                                                 setFieldValue("features", "");
//                                                 setFieldValue("duraction", "");
//                                                 setFieldValue("plan_name", "");
//                                                 setFieldValue("price", "");
//                                             }
//                                         }}
//                                     >
//                                         <option value="">Select Plan</option>
//                                         {storagePlans.map(plan => (
//                                             <option key={plan.id} value={plan.id}>
//                                                 {plan.plan_name} ({plan.duraction})
//                                             </option>
//                                         ))}
//                                     </Field> */}
//                                     {/* <Field
//                                         as="select"
//                                         name="plan_id"
//                                         className="upload-content-input"
//                                         onChange={(e) => {
//                                             const selectedId = Number(e.target.value);
//                                             setFieldValue("plan_id", selectedId);

//                                             // Find plan by ID in the full list
//                                             const selectedPlan = plans.find(plan => plan.id === selectedId);

//                                             if (selectedPlan) {
//                                                 const featureText = selectedPlan.features?.length
//                                                     ? selectedPlan.features.map(f => `• ${f}`).join("\n")
//                                                     : "";

//                                                 setFieldValue("features", featureText);
//                                                 setFieldValue("duraction", selectedPlan.duraction);
//                                                 setFieldValue("plan_name", selectedPlan.plan_name);
//                                                 setFieldValue("price", selectedPlan.price);
//                                             } else {
//                                                 setFieldValue("features", "");
//                                                 setFieldValue("duraction", "");
//                                                 setFieldValue("plan_name", "");
//                                                 setFieldValue("price", "");
//                                             }
//                                         }}
//                                     >
//                                         <option value="">Select Plan</option>
//                                         {plans.map(plan => (
//                                             <option key={plan.id} value={plan.id}>
//                                                 {plan.plan_name} ({plan.duraction})
//                                             </option>
//                                         ))}
//                                     </Field> */}
//                                     {/* <Field
//                                         as="select"
//                                         name="plan_id"
//                                         className="upload-content-input"
//                                         onChange={(e) => {
//                                             const selectedId = Number(e.target.value);

//                                             const selectedPlan = allPlansForBinding.find(plan => plan.id === selectedId);

//                                             if (selectedPlan) {
//                                                 const featureText = selectedPlan.features?.length
//                                                     ? selectedPlan.features.map(f => `• ${f}`).join("\n")
//                                                     : "";

//                                                 setValues(prevValues => ({
//                                                     ...prevValues,            // keep existing fields like is_active
//                                                     plan_id: selectedPlan.id,
//                                                     plan_name: selectedPlan.plan_name,
//                                                     duraction: selectedPlan.duraction,
//                                                     price: selectedPlan.price,
//                                                     features: featureText,
//                                                 }));
//                                             }
//                                         }}
//                                     >
//                                         <option value="">Select Plan</option>
//                                         {selectablePlans.map(plan => (
//                                             <option key={plan.id} value={plan.id}>
//                                                 {plan.plan_name} ({plan.duraction})
//                                             </option>
//                                         ))}
//                                     </Field> */}
//                                     <Field
//                                         as="select"
//                                         name="plan_id"
//                                         className="upload-content-input"
//                                         onChange={(e) => {
//                                             const selectedId = Number(e.target.value);

//                                             setFieldValue("plan_id", selectedId);

//                                             // Only subscription plans
//                                             const selectedPlan = plans
//                                                 .filter(p => p.is_storeage === 0)
//                                                 .find(p => p.id === selectedId);

//                                             if (selectedPlan) {

//                                                 const featureText = selectedPlan.features?.length
//                                                     ? selectedPlan.features.map(f => `• ${f}`).join("\n")
//                                                     : "";

//                                                 setFieldValue("plan_name", selectedPlan.plan_name);
//                                                 setFieldValue("duraction", selectedPlan.duraction);
//                                                 setFieldValue("price", selectedPlan.price);
//                                                 setFieldValue("features", featureText);

//                                             } else {

//                                                 setFieldValue("plan_name", "");
//                                                 setFieldValue("duraction", "");
//                                                 setFieldValue("price", "");
//                                                 setFieldValue("features", "");

//                                             }
//                                         }}
//                                     >
//                                         <option value="">Select Plan</option>

//                                         {plans
//                                             .filter(plan => plan.is_storeage === 0)
//                                             .map(plan => (
//                                                 <option key={plan.id} value={plan.id}>
//                                                     {plan.plan_name} ({plan.duraction})
//                                                 </option>
//                                             ))}
//                                     </Field>
//                                 </div>
//                                 {/* Price */}
//                                 <div>
//                                     <p className="upload-content-heading">Monthly Price ($)</p>
//                                     <Field
//                                         name="price"
//                                         type="number"
//                                         placeholder="0"
//                                         className="number-input"
//                                     />
//                                     <ErrorMessage name="price" render={(msg) => <div style={errorStyle}>{msg}</div>} />
//                                 </div>

//                                 {/* Active Toggle */}
//                                 <div className="active-plan">
//                                     <div>
//                                         <p className="upload-content-heading" style={{ marginBottom: "10px" }}>
//                                             Active Plan
//                                         </p>
//                                         <p className="active-text">
//                                             Make this plan available for subscription
//                                         </p>
//                                     </div>

//                                     <label className="switch">
//                                         <Field type="checkbox" name="is_active" />
//                                         <span className="slider"></span>
//                                     </label>
//                                 </div>

//                                 {/* Buttons */}
//                                 <div
//                                     style={{
//                                         display: "flex",
//                                         justifyContent: "flex-end",
//                                         gap: "10px",
//                                     }}
//                                 >
//                                     <button
//                                         type="button"
//                                         className="uploadCancel"
//                                         data-bs-dismiss="modal"
//                                     >
//                                         Cancel
//                                     </button>
//                                     <button type="submit" className="uploadSubmit" data-bs-dismiss="modal">
//                                         {isEdit ? "Update" : "Submit"}
//                                     </button>
//                                 </div>
//                             </Form>
//                         )}
//                     </Formik>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default AddEditPlanManagement;

// __________________________________________________________________________________________________________________
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const normalizeFeatures = (features) => {
    if (Array.isArray(features)) {
        return features
            .map((feature) => String(feature).replace(/^•\s*/, "").trim())
            .filter(Boolean);
    }

    if (typeof features !== "string") {
        return [];
    }

    const trimmedFeatures = features.trim();

    if (!trimmedFeatures) {
        return [];
    }

    try {
        const parsedFeatures = JSON.parse(trimmedFeatures);

        if (Array.isArray(parsedFeatures)) {
            return parsedFeatures
                .map((feature) => String(feature).replace(/^•\s*/, "").trim())
                .filter(Boolean);
        }
    } catch {
        // Fall back to plain text parsing when features is not valid JSON.
    }

    return trimmedFeatures
        .replace(/^\[|\]$/g, "")
        .split(/\r?\n|,/)
        .map((feature) => feature.replace(/^['"\s]*•?\s*/, "").replace(/['"\s]*$/g, "").trim())
        .filter(Boolean);
};

const formatFeaturesForTextarea = (features) =>
    normalizeFeatures(features).map((feature) => `• ${feature}`).join("\n");

const AddEditPlanManagement = ({ initialData = null, onSubmit }) => {
    const isEdit = Boolean(initialData);

    const initialValues = {
        plan_id: initialData?.plan_id || initialData?.id || "",
        plan_name: initialData?.plan_name || "",
        features: formatFeaturesForTextarea(initialData?.features),
        duraction: initialData?.duraction || "",
        price: initialData?.price || "",
        is_storeage: initialData ? String(Number(initialData?.is_storeage ?? 0)) : "",
        quantaty: initialData?.quantaty || "",
        storage_unit: initialData?.storage_unit || "",
        is_active: initialData ? Boolean(Number(initialData?.is_active)) : true,
    };

    const validationSchema = Yup.object({
        ...(isEdit && {
            plan_id: Yup.number()
                .typeError("Plan ID must be a number")
                .required("Plan ID is required"),
        }),
        plan_name: Yup.string().required("Plan name is required"),
        features: Yup.string().required("Features are required"),
        duraction: Yup.string()
            .oneOf(["month", "year"], "Please select Monthly or Yearly")
            .required("Duration is required"),
        price: Yup.number()
            .typeError("Price must be a number")
            .min(0, "Price cannot be negative")
            .required("Price is required"),
        is_storeage: Yup.string().required("Plan type is required"),
        quantaty: Yup.number().when("is_storeage", {
            is: "1",
            then: (schema) =>
                schema
                    .typeError("Quantity must be a number")
                    .min(0, "Quantity cannot be negative")
                    .required("Quantity is required"),
            otherwise: (schema) => schema.nullable().notRequired(),
        }),
        storage_unit: Yup.string().when("is_storeage", {
            is: "1",
            then: (schema) => schema.required("Storage unit is required"),
            otherwise: (schema) => schema.notRequired(),
        }),
    });

    const handleSubmit = async (values, { resetForm, setSubmitting }) => {
        const isStoragePlan = Number(values.is_storeage) === 1;
        const payload = {
            plan_name: values.plan_name.trim(),
            duraction: values.duraction.trim(),
            price: Number(values.price),
            is_storeage: Number(values.is_storeage),
            quantaty: isStoragePlan ? Number(values.quantaty) : 0,
            storage_unit: isStoragePlan ? values.storage_unit.trim() : "",
            features: normalizeFeatures(values.features),
            is_active: values.is_active ? 1 : 0,
            ...(isEdit && values.plan_id !== "" ? { plan_id: Number(values.plan_id) } : {}),
        };

        try {
            await onSubmit(payload);

            if (!isEdit) {
                resetForm();
            }

            const modalElement = document.getElementById("addplan");
            const closeButton = modalElement?.querySelector(".cross-dropdown");

            if (closeButton instanceof HTMLElement) {
                closeButton.click();
            } else if (modalElement && window.bootstrap?.Modal) {
                let modal = window.bootstrap.Modal.getInstance(modalElement);

                if (!modal) {
                    modal = new window.bootstrap.Modal(modalElement);
                }

                modal.hide();
            }
        } finally {
            setSubmitting(false);
        }
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
                        {({ values, setFieldValue }) => (

                            <Form className="upload-dropdowns">

                                {isEdit && (
                                    <div>
                                        <p className="upload-content-heading">Plan ID</p>

                                        <Field
                                            name="plan_id"
                                            type="number"
                                            placeholder="e.g. 13"
                                            className="upload-content-input"
                                        />

                                        <ErrorMessage
                                            name="plan_id"
                                            render={(msg) => <div style={errorStyle}>{msg}</div>}
                                        />
                                    </div>
                                )}

                                {/* Plan Name */}
                                <div>
                                    <p className="upload-content-heading">Plan Name</p>

                                    <Field
                                        name="plan_name"
                                        type="text"
                                        placeholder="e.g. Pro Plan"
                                        className="upload-content-input"
                                    />

                                    <ErrorMessage
                                        name="plan_name"
                                        render={(msg) => <div style={errorStyle}>{msg}</div>}
                                    />
                                </div>

                                {/* Features */}
                                <div>
                                    <p className="upload-content-heading">Features</p>

                                    <Field
                                        as="textarea"
                                        name="features"
                                        className="upload-content-textarea"
                                        placeholder="Add one feature per line"
                                    />

                                    <ErrorMessage
                                        name="features"
                                        render={(msg) => <div style={errorStyle}>{msg}</div>}
                                    />
                                </div>

                                {/* Select Plan */}
                                <div>
                                    <p className="upload-content-heading">Select Plan</p>

                                    <Field
                                        as="select"
                                        name="duraction"
                                        className="upload-content-input"
                                    >
                                        <option value="">Select Plan</option>
                                        <option value="month">Monthly</option>
                                        <option value="year">Yearly</option>
                                    </Field>

                                    <ErrorMessage
                                        name="duraction"
                                        render={(msg) => <div style={errorStyle}>{msg}</div>}
                                    />
                                </div>

                                <div style={{ display: "flex", gap: "18px" }}>
                                    <div style={{ flex: 1 }}>
                                        <p className="upload-content-heading">Subscription Price ($)</p>

                                        <Field
                                            name="price"
                                            type="number"
                                            placeholder="0"
                                            className="number-input"
                                            style={{ width: "100%" }}
                                        />

                                        <ErrorMessage
                                            name="price"
                                            render={(msg) => <div style={errorStyle}>{msg}</div>}
                                        />
                                    </div>

                                    <div style={{ flex: 1 }}>
                                        <p className="upload-content-heading">Plan Type</p>

                                        <Field
                                            name="is_storeage"
                                            as="select"
                                            className="upload-content-input"
                                            onChange={(e) => {
                                                const { value } = e.target;
                                                setFieldValue("is_storeage", value);

                                                if (value === "0") {
                                                    setFieldValue("quantaty", "");
                                                    setFieldValue("storage_unit", "");
                                                }
                                            }}
                                        >
                                            <option value="">Select plan type</option>
                                            <option value="1">Storage</option>
                                            <option value="0">Platform</option>
                                        </Field>

                                        <ErrorMessage
                                            name="is_storeage"
                                            render={(msg) => <div style={errorStyle}>{msg}</div>}
                                        />
                                    </div>
                                </div>

                                {values.is_storeage === "1" && (
                                    <div
                                        className="plan-storage-row"
                                        style={{ display: "flex", gap: "18px" }}
                                    >
                                        <div className="plan-storage-field" style={{ flex: 1 }}>
                                            <p className="upload-content-heading">Quantity</p>

                                            <Field
                                                name="quantaty"
                                                type="number"
                                                placeholder="e.g. 10"
                                                className="number-input plan-storage-input"
                                                style={{ width: "100%" }}
                                            />

                                            <ErrorMessage
                                                name="quantaty"
                                                render={(msg) => <div style={errorStyle}>{msg}</div>}
                                            />
                                        </div>

                                        <div className="plan-storage-field" style={{ flex: 1 }}>
                                            <p className="upload-content-heading">Storage Unit</p>

                                            <Field
                                                name="storage_unit"
                                                as="select"
                                                className="upload-content-input plan-storage-input"
                                                style={{ width: "100%" }}
                                            >
                                                <option value="">Select storage unit</option>
                                                <option value="MB">MB</option>
                                                <option value="GB">GB</option>
                                                <option value="TB">TB</option>
                                            </Field>

                                            <ErrorMessage
                                                name="storage_unit"
                                                render={(msg) => <div style={errorStyle}>{msg}</div>}
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* Active Toggle */}
                                <div className="active-plan">

                                    <div>
                                        <p
                                            className="upload-content-heading"
                                            style={{ marginBottom: "10px" }}
                                        >
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

                                    <button
                                        type="submit"
                                        className="uploadSubmit"
                                    >
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
