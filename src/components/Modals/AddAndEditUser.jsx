// import React, { useEffect, useRef, useState } from "react";
// import { useFormik } from "formik";
// import { useDispatch, useSelector } from "react-redux";
// import { allPlans } from "../../redux/admin/slices/adminSlices";


// const AddAndEditUser = ({ editedData = {}, onSubmit }) => {
//     const hasFetched = useRef(false);
//     const dispatch = useDispatch();
//     const { plans } = useSelector((state) => state.user)
//     const [allPlan, setAllPlan] = useState([])

//     console.log("checkdtaaaaaabc__", allPlan)

//     useEffect(() => {
//         if (hasFetched.current) return;
//         hasFetched.current = true;
//         dispatch(allPlans())
//     }, []);
//     // useEffect(() => {
//     //     if (plans) {
//     //         setAllPlan(plans)
//     //     }
//     // }, [plans]);
//     useEffect(() => {
//         if (plans && plans.length > 0) {

//             const filteredPlans = plans.filter(plan => {
//                 if (
//                     (plan.duraction === "yearly" || plan.duraction === "month") &&
//                     plan.is_storeage === 1
//                 ) {
//                     return false;
//                 }

//                 return true;
//             });

//             setAllPlan(filteredPlans);
//         }
//     }, [plans]);

//     const formik = useFormik({
//         initialValues: {
//             id: editedData.id || '',
//             name: editedData.name || "",
//             email: editedData.email || "",
//             phone: editedData.phone || "",
//             plan_id: editedData.plan_id || "13",
//             payment_status: editedData.payment_status || "unpaid",
//         },
//         enableReinitialize: true,
//         onSubmit: (values, actions) => {
//             console.log("Form submitted:", values);
//             if (onSubmit) onSubmit(values);
//             actions.resetForm();
//         },
//     });

//     return (
//         <div
//             className="modal fade"
//             id="editUserModal"
//             tabIndex="-1"
//             aria-hidden="true"
//         >
//             <div
//                 className="modal-dialog modal-dialog-centered modal-lg"
//                 style={{ width: "462px" }}
//             >
//                 <div className="modal-content upload-template-popup">
//                     <div className="modal-header upload-header">
//                         <label className="modal-heading">
//                             {editedData?.id ? "Edit User" : "Add User"}
//                         </label>
//                         <img
//                             src="./images/cross-dropdown.svg"
//                             className="cross-dropdown"
//                             style={{ cursor: "pointer" }}
//                             data-bs-dismiss="modal"
//                             aria-label="Close"
//                         />
//                     </div>

//                     <form className="upload-dropdowns" onSubmit={formik.handleSubmit}>
//                         {/* Name */}
//                         <div>
//                             <p className="upload-content-heading">Name</p>
//                             <input
//                                 type="text"
//                                 name="name"
//                                 placeholder="Enter Name"
//                                 className="upload-content-input"
//                                 value={formik.values.name}
//                                 onChange={formik.handleChange}
//                             />
//                         </div>

//                         {/* Email */}
//                         <div>
//                             <p className="upload-content-heading">Email ID</p>
//                             <input
//                                 type="email"
//                                 name="email"
//                                 placeholder="Enter Email ID"
//                                 className="upload-content-input"
//                                 value={formik.values.email}
//                                 onChange={formik.handleChange}
//                             />
//                         </div>

//                         {/* Phone */}
//                         <div>
//                             <p className="upload-content-heading">Phone Number</p>
//                             <input
//                                 type="text"
//                                 name="phone"
//                                 placeholder="Enter Phone Number"
//                                 className="upload-content-input"
//                                 value={formik.values.phone}
//                                 onChange={formik.handleChange}
//                             />
//                         </div>

//                         {/* Plan */}
//                         <div>
//                             <p className="upload-content-heading">Plan</p>
//                             <select
//                                 name="plan_id"
//                                 className="upload-content-input"
//                                 value={formik.values.plan_id}
//                                 onChange={formik.handleChange}
//                             >
//                                 {allPlan.length > 0 &&
//                                     allPlan.map((item, index) => (
//                                         <option key={index} value={item?.id}>
//                                             {item?.duraction}
//                                         </option>
//                                     ))}

//                                 {/* Optional static fallback options */}
//                             </select>
//                         </div>

//                         {/* Payment Switch */}
//                         {/* <div className="payment-div">
//                             <div
//                                 style={{
//                                     display: "flex",
//                                     flexDirection: "column",
//                                     gap: "10px",
//                                 }}
//                             >
//                                 <p
//                                     className="upload-content-heading"
//                                     style={{ margin: 0 }}
//                                 >
//                                     Payment Status
//                                 </p>
//                                 <p className="switch-text">Switch to mark as paid</p>
//                             </div>

//                             <label className="switch">
//                                 <input
//                                     type="checkbox"
//                                     name="paymentStatus"
//                                     checked={formik.values.paymentStatus}
//                                     onChange={formik.handleChange}
//                                 />
//                                 <span className="slider"></span>
//                             </label>
//                         </div> */}
//                         <div className="payment-div">
//                             {/* <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
//                                 <p className="upload-content-heading" style={{ margin: 0 }}>
//                                     Payment Status
//                                 </p>
//                                 <p className="switch-text">Switch to mark as paid</p>
//                             </div> */}

//                             <label className="switch">
//                                 <input
//                                     type="checkbox"
//                                     name="payment_status"
//                                     checked={formik.values.payment_status === "paid"}
//                                     onChange={(e) =>
//                                         formik.setFieldValue(
//                                             "payment_status",
//                                             e.target.checked ? "paid" : "unpaid"
//                                         )
//                                     }
//                                 />
//                                 <span className="slider"></span>
//                             </label>
//                         </div>


//                         {/* Buttons */}
//                         <div
//                             style={{
//                                 display: "flex",
//                                 width: "100%",
//                                 justifyContent: "end",
//                                 gap: "10px",
//                             }}
//                         >
//                             <button
//                                 type="button"
//                                 className="uploadCancel"
//                                 data-bs-dismiss="modal"
//                             >
//                                 Cancel
//                             </button>
//                             <button type="submit" className="uploadSubmit" data-bs-dismiss="modal">
//                                 {editedData?.id ? "Update User" : "Add User"}
//                             </button>
//                         </div>
//                     </form>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default AddAndEditUser;





import React, { useEffect, useRef, useState } from "react";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { allPlans } from "../../redux/admin/slices/adminSlices";


const AddAndEditUser = ({ editedData = {}, onSubmit }) => {
    const hasFetched = useRef(false);
    const dispatch = useDispatch();
    const { plans } = useSelector((state) => state.user)
    const [allPlan, setAllPlan] = useState([])
    useEffect(() => {
        if (hasFetched.current) return;
        hasFetched.current = true;
        dispatch(allPlans())
    }, []);
    // useEffect(() => {
    //     if (plans) {
    //         setAllPlan(plans)
    //     }
    // }, [plans]);

    useEffect(() => {
        if (plans && plans.length > 0) {

            const filteredPlans = plans.filter(plan => {
                return plan.is_storeage == 0;
            });
            setAllPlan(filteredPlans);
        }
    }, [plans]);

    const isEditMode = !!editedData?.id;

    const formik = useFormik({
        initialValues: {
            id: editedData.id || '',
            name: editedData.name || "",
            email: editedData.email || "",
            phone: editedData.phone || "",
            plan_id: editedData.plan_id || "13",
            payment_status: editedData.payment_status || "unpaid",
        },
        enableReinitialize: true,
        onSubmit: (values, actions) => {
            console.log("Form submitted:", values);
            if (onSubmit) onSubmit(values);
            actions.resetForm();
        },
    });

    return (
        <div
            className="modal fade"
            id="editUserModal"
            tabIndex="-1"
            aria-hidden="true"
        >
            <div
                className="modal-dialog modal-dialog-centered modal-lg"
                style={{ width: "462px" }}
            >
                <div className="modal-content upload-template-popup">
                    <div className="modal-header upload-header">
                        <label className="modal-heading">
                            {editedData?.id ? "Edit User" : "Add User"}
                        </label>
                        <img
                            src="./images/cross-dropdown.svg"
                            className="cross-dropdown"
                            style={{ cursor: "pointer" }}
                            data-bs-dismiss="modal"
                            aria-label="Close"
                        />
                    </div>

                    <form className="upload-dropdowns" onSubmit={formik.handleSubmit}>
                        {/* Name */}
                        <div>
                            <p className="upload-content-heading">Name</p>
                            <input
                                type="text"
                                name="name"
                                placeholder="Enter Name"
                                className="upload-content-input"
                                value={formik.values.name}
                                onChange={formik.handleChange}
                                readOnly={isEditMode}
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <p className="upload-content-heading">Email ID</p>
                            <input
                                type="email"
                                name="email"
                                placeholder="Enter Email ID"
                                className="upload-content-input"
                                value={formik.values.email}
                                onChange={formik.handleChange}
                                readOnly={isEditMode}
                            />
                        </div>

                        {/* Phone */}
                        <div>
                            <p className="upload-content-heading">Phone Number</p>
                            <input
                                type="text"
                                name="phone"
                                placeholder="Enter Phone Number"
                                className="upload-content-input"
                                value={formik.values.phone}
                                onChange={formik.handleChange}
                                readOnly={isEditMode}
                            />
                        </div>

                        {/* Plan */}
                        <div>
                            <p className="upload-content-heading">Plan</p>
                            <select
                                name="plan_id"
                                className="upload-content-input"
                                value={formik.values.plan_id}
                                onChange={formik.handleChange}
                            >
                                {allPlan.length > 0 &&
                                    allPlan.map((item, index) => (
                                        <option key={index} value={item?.id}>
                                            {item?.duraction}
                                        </option>
                                    ))}

                                {/* Optional static fallback options */}
                            </select>
                        </div>

                        {/* Payment Switch */}
                        {/* <div className="payment-div">
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "10px",
                                }}
                            >
                                <p
                                    className="upload-content-heading"
                                    style={{ margin: 0 }}
                                >
                                    Payment Status
                                </p>
                                <p className="switch-text">Switch to mark as paid</p>
                            </div>

                            <label className="switch">
                                <input
                                    type="checkbox"
                                    name="paymentStatus"
                                    checked={formik.values.paymentStatus}
                                    onChange={formik.handleChange}
                                />
                                <span className="slider"></span>
                            </label>
                        </div> */}
                        <div className="payment-div">
                            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                                <p className="upload-content-heading" style={{ margin: 0 }}>
                                    Payment Status
                                </p>
                                <p className="switch-text">Switch to mark as paid</p>
                            </div>

                            <label className="switch">
                                <input
                                    type="checkbox"
                                    name="payment_status"
                                    checked={formik.values.payment_status === "paid"}
                                    onChange={(e) =>
                                        formik.setFieldValue(
                                            "payment_status",
                                            e.target.checked ? "paid" : "unpaid"
                                        )
                                    }
                                />
                                <span className="slider"></span>
                            </label>
                        </div>


                        {/* Buttons */}
                        <div
                            style={{
                                display: "flex",
                                width: "100%",
                                justifyContent: "end",
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
                                {editedData?.id ? "Update User" : "Add User"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddAndEditUser;

