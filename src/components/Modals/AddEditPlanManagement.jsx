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
import { useEffect, useRef } from 'react'
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from 'react-redux'
import { getPlans } from '../../redux/admin/slices/planSlices'

const AddEditPlanManagement = ({ initialData = null, onSubmit }) => {

    const dispatch = useDispatch();
    const hasFetched = useRef(false);
    const isEdit = Boolean(initialData);

    const { allPlans } = useSelector((state) => state.plans);

    useEffect(() => {
        if (hasFetched.current) return;
        hasFetched.current = true;
        dispatch(getPlans())
    }, [dispatch])

    const storageType = initialData?.is_storeage ?? 0;

    const filteredPlans = (allPlans || []).filter(
        (plan) => Number(plan.is_storeage) === Number(storageType)
    );

    const initialValues = {
        plan_id: initialData?.id || "",
        plan_name: initialData?.plan_name || "",
        features: initialData?.features
            ? initialData.features.map(f => `• ${f}`).join("\n")
            : "",
        duraction: initialData?.duraction || "",
        price: initialData?.price || "",
        is_active: initialData ? Boolean(Number(initialData?.is_active)) : true,
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
                ? values.features
                    .split("\n")
                    .map(f => f.replace(/^•\s*/, "").trim())
                    .filter(f => f !== "")
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
                        {({ setFieldValue }) => (

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
                                        disabled
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
                                        name="plan_id"
                                        className="upload-content-input"
                                        onChange={(e) => {

                                            const selectedId = Number(e.target.value);

                                            setFieldValue("plan_id", selectedId);

                                            const selectedPlan = filteredPlans.find(
                                                (plan) => plan.id === selectedId
                                            );

                                            if (selectedPlan) {

                                                const featureText = selectedPlan.features
                                                    ?.map(f => `• ${f}`)
                                                    .join("\n");

                                                setFieldValue("features", featureText || "");
                                                setFieldValue("price", selectedPlan.price);
                                                setFieldValue("duraction", selectedPlan.duraction);
                                                setFieldValue("plan_name", selectedPlan.plan_name);
                                            }

                                        }}
                                    >
                                        {/* <option value="">Select Plan</option> */}

                                        {filteredPlans.map((plan) => (
                                            <option key={plan.id} value={plan.id}>
                                                {plan.plan_name} ({plan.duraction})
                                            </option>
                                        ))}
                                    </Field>
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

                                    <ErrorMessage
                                        name="price"
                                        render={(msg) => <div style={errorStyle}>{msg}</div>}
                                    />
                                </div>

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
                                        data-bs-dismiss="modal"
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