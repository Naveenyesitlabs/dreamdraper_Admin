import React, { createContext, useState, useContext } from "react";

const SidebarContext = createContext();

export const useSidebar = () => useContext(SidebarContext);

export const SidebarProvider = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true); 
    const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);
    const closeSidebar = () => setIsSidebarOpen(false);
    const openSidebar = () => setIsSidebarOpen(true);

    return (
        <SidebarContext.Provider
            value={{ isSidebarOpen, toggleSidebar, openSidebar, closeSidebar }}
        >
            {children}
        </SidebarContext.Provider>
    );
};
