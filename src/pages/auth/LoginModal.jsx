// import React, { useState } from "react";
// import { useFormik } from "formik";
// import * as Yup from "yup";
// import { useDispatch } from "react-redux";
// import { loginAdmin } from "../../redux/admin/slices/adminSlices";
// import { useNavigate } from "react-router-dom";

// const LoginModal = () => {
//   const navigate = useNavigate()
//   const [showPassword, setShowPassword] = useState(false);
//   const dispatch = useDispatch()

//   const formik = useFormik({
//     initialValues: {
//       email: "",
//       password: "",
//       remember: false,
//     },
//     validationSchema: Yup.object({
//       email: Yup.string()
//         .email("Invalid email address")
//         .required("Email is required"),
//       password: Yup.string().required("Password is required"),
//     }),
//     onSubmit: async (values) => {
//       console.log("Form Data:", values);
//       const loginAdmin2 = await dispatch(loginAdmin(values));
//       if (loginAdmin2?.payload?.success) {
//         navigate("/user-management");
//       }
//     },
//   });

//   return (
//     <>
//       <div className="main-wrap">
//         <div
//           className="modal fade dream-login-modal"
//           id="dreamLoginModal"
//           tabIndex="-1"
//           aria-labelledby="dreamLoginLabel"
//           aria-hidden="false"
//         >
//           <div className="modal-dialog modal-dialog-centered dream-wrapup-top">
//             <div
//               className="modal-content dream-wrapup"
//               style={{ borderRadius: "12px" }}
//             >
//               <button
//                 type="button"
//                 className="btn-close dream-login-close"
//                 data-bs-dismiss="modal"
//                 aria-label="Close"
//               ></button>

//               <p className="heading-login">Login</p>
//               <p className="text-login">
//                 Welcome back! Please enter your details
//               </p>

//               <form onSubmit={formik.handleSubmit}>
//                 {/* Email Field */}
//                 <div className="login-inputs" style={{
//                   marginBottom: '10px'
//                 }}>
//                   <img
//                     src="./images/emailSignature.svg"
//                     className="emailImg"
//                     alt="email"
//                   />
//                   <img src="./images/Line.svg" className="LineImg" alt="line" />
//                   <input
//                     type="text"
//                     placeholder="Email address"
//                     className="email-input-login"
//                     id="email"
//                     name="email"
//                     onChange={formik.handleChange}
//                     onBlur={formik.handleBlur}
//                     value={formik.values.email}
//                   />
//                 </div>
//                 {formik.touched.email && formik.errors.email ? (
//                   <p
//                     style={{ color: "red", fontSize: "12px", marginTop: "4px" }}
//                   >
//                     {formik.errors.email}
//                   </p>
//                 ) : null}

//                 {/* Password Field */}
//                 <div className="login-inputs">
//                   <img
//                     src="./images/PasswordSignature.svg"
//                     className="passImg"
//                     alt="password"
//                   />
//                   <img src="./images/Line.svg" className="LineImg" alt="line" />
//                   <div className="input-grp mb-0 password-grp">
//                     <input
//                       type={showPassword ? "text" : "password"}
//                       placeholder="Enter Password"
//                       className="password"
//                       id="password"
//                       name="password"
//                       onChange={formik.handleChange}
//                       onBlur={formik.handleBlur}
//                       value={formik.values.password}
//                     />
//                     <div
//                       className="password-eye"
//                       onClick={() => setShowPassword(!showPassword)}
//                       style={{ cursor: "pointer" }}
//                     >
//                       <div
//                         className={`eye ${showPassword ? "eye-open" : "eye-close"
//                           }`}
//                       ></div>
//                     </div>
//                   </div>
//                 </div>
//                 {formik.touched.password && formik.errors.password ? (
//                   <p
//                     style={{ color: "red", fontSize: "12px", marginTop: "4px" }}
//                   >
//                     {formik.errors.password}
//                   </p>
//                 ) : null}

//                 {/* Remember Me */}
//                 <p className="remember" style={{
//                   marginLeft: '130px'
//                 }}>
//                   <input
//                     type="checkbox"
//                     id="remember"
//                     name="remember"
//                     onChange={formik.handleChange}
//                     checked={formik.values.remember}
//                   />
//                   Remember Me
//                 </p>

//                 {/* Submit Button */}
//                 <button type="submit" className="login-btn" data-bs-dismiss="modal">
//                   <span className="login-link">Log In</span>
//                 </button>
//               </form>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default LoginModal;







import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { loginAdmin } from "../../redux/admin/slices/adminSlices";
import { useNavigate } from "react-router-dom";

const LoginModal = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      remember: false,
    },

    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),

      password: Yup.string()
        .required("Password is required")
        .min(8, "Password must be at least 8 characters")
        .matches(/[a-z]/, "Password must contain at least one lowercase letter")
        .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
        .matches(/[0-9]/, "Password must contain at least one number")
        .matches(
          /[@$!%*?&#]/,
          "Password must contain at least one special character"
        ),
    }),

    onSubmit: async (values) => {
      const response = await dispatch(loginAdmin(values));
      if (response?.payload?.success) {
        document.querySelector('[data-bs-dismiss="modal"]')?.click();
        navigate("/user-management");

      }
    },
  });

  return (
    <div className="main-wrap">
      <div
        className="modal fade dream-login-modal"
        id="dreamLoginModal"
        tabIndex="-1"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered dream-wrapup-top">
          <div className="modal-content dream-wrapup" style={{ borderRadius: "12px" }}>
            <button
              type="button"
              className="btn-close dream-login-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>

            <p className="heading-login">Login</p>
            <p className="text-login">Welcome back! Please enter your details</p>

            <form onSubmit={formik.handleSubmit} noValidate>
              {/* Email */}
              <div className="login-inputs" style={{ marginBottom: "10px" }}>
                <img src="./images/emailSignature.svg" className="emailImg" alt="email" />
                <img src="./images/Line.svg" className="LineImg" alt="line" />
                <input
                  type="email"
                  name="email"
                  placeholder="Email address"
                  className="email-input-login"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.email}
                />
              </div>
              {formik.touched.email && formik.errors.email && (
                <p style={{ color: "red", fontSize: "12px" }}>
                  {formik.errors.email}
                </p>
              )}

              {/* Password */}
              <div className="login-inputs">
                <img src="./images/PasswordSignature.svg" className="passImg" alt="password" />
                <img src="./images/Line.svg" className="LineImg" alt="line" />
                <div className="input-grp mb-0 password-grp">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Enter Password"
                    className="password"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.password}
                  />
                  <div
                    className="password-eye"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ cursor: "pointer" }}
                  >
                    <div className={`eye ${showPassword ? "eye-open" : "eye-close"}`}></div>
                  </div>
                </div>
              </div>
              {formik.touched.password && formik.errors.password && (
                <p style={{ color: "red", fontSize: "12px" }}>
                  {formik.errors.password}
                </p>
              )}

              {/* Remember Me */}
              <p className="remember" style={{ marginLeft: "130px" }}>
                <input
                  type="checkbox"
                  name="remember"
                  checked={formik.values.remember}
                  onChange={formik.handleChange}
                />
                Remember Me
              </p>

              {/* Submit */}
              {/* <button type="submit" className="login-btn" data-bs-dismiss="modal"
              data-bs-target="#dreamLoginModal"
              > */}
              <button type="submit" className="login-btn">
                <span className="login-link">Log In</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
