import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import React, { useState } from "react";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import UserManagement from "./pages/UserManagement";
import ProjectManagement from "./pages/ProjectManagement";
import LibraryManagement from "./pages/LibraryManagement";
import TutorialsAndMedia from "./pages/TutorialsAndMedia";
import MeasuringForms from "./pages/MeasuringForms";
import Showcases from "./pages/Showcases";
import SubscriptionManagement from "./pages/SubscriptionManagement";
import PlanManagement from "./pages/PlanManagement";
import MainCategory from "./pages/categoryManager/MainCategory";
import SubCategory from "./pages/categoryManager/SubCategory";
import NestedCategory from "./pages/categoryManager/NestedCategory";
import SubNestedCategory from "./pages/categoryManager/SubNestedCategory";
import RootModal from "./pages/auth/RootModal";
import NotFound from "./pages/NotFound";
import { SidebarProvider } from "./hooks/SidebarContext";
import { ToastContainer } from "react-toastify";
function AppLayout() {
  const location = useLocation();
  const isLoginPage = location.pathname === "/";

  return (
    <div className="dash-body">
      {isLoginPage ? (
        <Routes>
          <Route path="/" element={<RootModal />} />
        </Routes>
      ) : (
        <>
          <Navbar />
          <div className="layout">
            <Sidebar />
            <Routes>
              <Route path="/user-management" element={<UserManagement />} />
              <Route path="/project-management" element={<ProjectManagement />} />
              <Route path="/library-management" element={<LibraryManagement />} />
              <Route path="/tutorials-Media" element={<TutorialsAndMedia />} />
              <Route path="/measuring-forms" element={<MeasuringForms />} />
              <Route path="/show-cases" element={<Showcases />} />
              <Route path="/subscription-management" element={<SubscriptionManagement />} />
              <Route path="/plan-management" element={<PlanManagement />} />
              <Route path="/main-category" element={<MainCategory />} />
              <Route path="/sub-category" element={<SubCategory />} />
              <Route path="/nested-category" element={<NestedCategory />} />
              <Route path="/sub-nested-category" element={<SubNestedCategory />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </>
      )}
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <SidebarProvider>
        <ToastContainer
          autoClose={1500} 
          hideProgressBar={false}
          pauseOnHover={true}
          newestOnTop={false}
        />
        <AppLayout />
      </SidebarProvider>
    </Router>
  );
}