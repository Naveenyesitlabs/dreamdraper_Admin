// import React, { useState } from "react";
// import { useLocation, Link } from "react-router-dom";
// import { useSidebar } from "../hooks/SidebarContext";

// export default function Sidebar() {
//   const { isSidebarOpen } = useSidebar();
//   const location = useLocation();
//   const [isCategoryOpen, setIsCategoryOpen] = useState(false);

//   const sidebarLinks = [
//     { name: "User Management", path: "/user-management", icon: "/images/usermanagement.svg" },
//     { name: "Project Management", path: "/project-management", icon: "/images/projmngmt.svg" },
//     { name: "Library Management", path: "/library-management", icon: "/images/library.svg" },
//     {
//       name: "Category Manager",
//       icon: "/images/category.svg",
//       isDropdown: true,
//       subLinks: [
//         { name: "Main Category", path: "/main-category" },
//         { name: "Sub Category", path: "/sub-category" },
//         { name: "Nested Category", path: "/nested-category" },
//         { name: "Sub-Nested Category", path: "/sub-nested-category" },
//       ],
//     },
//     { name: "Tutorials & Media", path: "/tutorials-Media", icon: "/images/tutorials.svg" },
//     { name: "Measuring Forms", path: "/measuring-forms", icon: "/images/forms.svg" },
//     { name: "Showcases", path: "/show-cases", icon: "/images/showcases.svg" },
//     { name: "Subscription Management", path: "/subscription-management", icon: "/images/subscription.svg" },
//     { name: "Plan Management", path: "/plan-management", icon: "/images/plan.svg" },
//   ];

//   const isActive = (path) => location.pathname === path;
//   const isDropdownActive = (dropdown) =>
//     dropdown.subLinks.some((sub) => isActive(sub.path));

//   return (
//     <div className={`sidebar ${isSidebarOpen ? "" : "hidden"}`} id="sidebar">
//       <h4 className="sidebar-heading">Navigation</h4>

//       {sidebarLinks.map((link, i) => {
//         if (link.isDropdown) {
//           const dropdownOpen = isCategoryOpen || isDropdownActive(link);
//           return (
//             <div key={i}>
//               <p
//                 className="sidebar-option dropdown-toggle" // ❌ no active class here
//                 onClick={() => setIsCategoryOpen(!isCategoryOpen)}
//                 style={{ cursor: "pointer" }}
//               >
//                 <img src={link.icon} className="sidebarIcons" alt="" /> {link.name}
//               </p>

//               <div
//                 className={`collapse ${dropdownOpen ? "show" : ""}`}
//                 style={{
//                   marginLeft: "20px",
//                   visibility: dropdownOpen ? "visible" : "hidden",
//                 }}
//               >
//                 {link.subLinks.map((sub, j) => (
//                   <Link
//                     key={j}
//                     to={sub.path}
//                     onClick={() => setIsCategoryOpen(true)}
//                     className={`side-sub-option ${
//                       isActive(sub.path) ? "sub-active" : ""
//                     }`}
//                     style={{ textDecoration: "none", color: "#fff" }}
//                   >
//                     <img
//                       src="/images/message.svg"
//                       className="message-sideoption"
//                       alt=""
//                     />
//                     <p className="sidebar-option side-submenu">{sub.name}</p>
//                   </Link>
//                 ))}
//               </div>
//             </div>
//           );
//         }
//         const isCurrentlyActive = isActive(link.path);

//         return (
//           <Link
//             key={i}
//             to={link.path}
//             onClick={() => setIsCategoryOpen(false)}
//             className={`sidebar-link ${isCurrentlyActive ? "active" : ""}`}
//             style={{ textDecoration: "none", color: "#fff" }}
//           >
//             <p
//               className={`sidebar-option ${isCurrentlyActive ? "active" : ""}`}
//             >
//               <img src={link.icon} className="sidebarIcons" alt="" /> {link.name}
//             </p>
//           </Link>
//         );
//       })}
//     </div>
//   );
// }





import React, { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { useSidebar } from "../hooks/SidebarContext";

export default function Sidebar() {
  const { isSidebarOpen } = useSidebar();
  const location = useLocation();
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const sidebarLinksWithName = [
    { name: "User Management", path: "/user-management", icon: "/images/usermanagement.svg" },
    { name: "Project Management", path: "/project-management", icon: "/images/projmngmt.svg" },
    { name: "Library Management", path: "/library-management", icon: "/images/library.svg" },
    {
      name: "Category Manager",
      icon: "/images/category.svg",
      isDropdown: true,
      subLinks: [
        { name: "Main Category", path: "/main-category" },
        { name: "Sub Category", path: "/sub-category" },
        { name: "Nested Category", path: "/nested-category" },
        { name: "Sub-Nested Category", path: "/sub-nested-category" },
      ],
    },
    { name: "Tutorials & Media", path: "/tutorials-Media", icon: "/images/tutorials.svg" },
    { name: "Measuring Forms", path: "/measuring-forms", icon: "/images/forms.svg" },
    { name: "Showcases", path: "/show-cases", icon: "/images/showcases.svg" },
    { name: "Subscription Management", path: "/subscription-management", icon: "/images/subscription.svg" },
    { name: "Plan Management", path: "/plan-management", icon: "/images/plan.svg" },
  ];

  const sidebarLinksWithIcon = [
    { path: "/user-management", icon: "/images/usermanagement.svg" },
    { path: "/project-management", icon: "/images/projmngmt.svg" },
    { path: "/library-management", icon: "/images/library.svg" },
    {
      icon: "/images/category.svg",
      isDropdown: true,
      subLinks: [
        { path: "/main-category" },
        { path: "/sub-category" },
        { path: "/nested-category" },
        { path: "/sub-nested-category" },
      ],
    },
    { path: "/tutorials-Media", icon: "/images/tutorials.svg" },
    { path: "/measuring-forms", icon: "/images/forms.svg" },
    { path: "/show-cases", icon: "/images/showcases.svg" },
    { path: "/subscription-management", icon: "/images/subscription.svg" },
    { path: "/plan-management", icon: "/images/plan.svg" },
  ];

  const isActive = (path) => location.pathname === path;
  const isDropdownActive = (dropdown) =>
    dropdown.subLinks.some((sub) => isActive(sub.path));

  return (
    <div className={`sidebar ${isSidebarOpen ? "" : "hidden"}`} id="sidebar">
      {/* <h4 className="sidebar-heading">Navigation</h4> */}
      {
        sidebarLinksWithName.map((link, i) => {
          if (link.isDropdown) {
            const dropdownActive = isDropdownActive(link);
            const dropdownOpen = isCategoryOpen || dropdownActive;
            return (
              <div key={i}>
                <p
                  className={`sidebar-option dropdown-toggle ${dropdownActive ? "active" : ""
                    }`}
                  onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                  style={{ cursor: "pointer" }}
                >
                  <img src={link.icon} className="sidebarIcons" alt="" /> {isSidebarOpen ? link.name : ''}
                </p>

                <div
                  className={`collapse ${dropdownOpen ? "show" : ""}`}
                  style={{
                    // marginLeft: "20px", 
                    visibility: dropdownOpen ? "visible" : "hidden",
                    marginLeft: dropdownOpen && !isSidebarOpen? "-84px" : ' '
                  }}
                >
                  {link.subLinks.map((sub, j) => (
                    <Link
                      key={j}
                      to={sub.path}
                      onClick={() => setIsCategoryOpen(false)}
                      className={`side-sub-option ${isActive(sub.path) ? "sub-active" : ""
                        }`}
                      style={{ textDecoration: "none", color: "#fff" }}
                    >
                      <img
                        src="/images/message.svg"
                        className="message-sideoption"
                        alt=""
                      />
                      <p className="sidebar-option side-submenu">{isSidebarOpen ? sub.name : ''}</p>
                    </Link>
                  ))}
                </div>
              </div>
            );
          }
          const dropdownIsActiveGlobally = sidebarLinksWithName
            .find((l) => l.isDropdown)
            ?.subLinks.some((sub) => isActive(sub.path));

          const isCurrentlyActive =
            isActive(link.path) && !dropdownIsActiveGlobally;
          return (
            <Link
              key={i}
              to={link.path}
              onClick={() => setIsCategoryOpen(false)}
              className={`sidebar-link ${isCurrentlyActive ? "active" : ""}`}
              style={{ textDecoration: "none", color: "#fff" }}
            >
              <p
                className={`sidebar-option ${isCurrentlyActive ? "active" : ""
                  }`}
              >
                <img src={link.icon} className="sidebarIcons" alt="" />{" "}
                {isSidebarOpen ? link.name : ''}
              </p>
            </Link>
          );
        })
      }
    </div>
  );
}
