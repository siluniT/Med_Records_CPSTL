// src/Components/AppSidebar.jsx
import React from "react";
import AppSidebarNav from "./AppSidebarNav";

const AppSidebar = ({ isSidebarOpen, onCloseSidebar, currentPage }) => {
  // Retrieve user data from localStorage
  const storeData = localStorage.getItem("userData");
  const userData = storeData ? JSON.parse(storeData) : null;
  const userName = userData?.name || "User";

  return (
    <>
      {/* Mobile Backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-40 md:hidden"
          onClick={onCloseSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 bg-white text-gray-900 shadow-xl transform transition-transform duration-300 z-50 md:relative md:translate-x-0 ${
          isSidebarOpen ? "translate-x-0 w-64" : "-translate-x-full md:w-20"
        }`}
      >
        {/* Logo and Clinic Name Section */}
        <div
          className={`p-4 flex flex-col items-center justify-center border-b border-gray-200 ${
            isSidebarOpen ? "w-64" : "w-20"
          }`}
        >
          <div className="flex items-center">
            {" "}
            {/* Flex container for logo and text */}
            <img
              src="public/medi.jpeg"
              alt="CPSTL MedRecord Logo"
              className={`object-cover transition-all duration-300 ${
                isSidebarOpen ? "w-19 h-20 mr-2" : "w-20 h-30" // Increased logo size when open and closed
              }`}
            />
            {isSidebarOpen && (
              <h2 className="text-lg font-bold text-gray-900 whitespace-nowrap">
                CPSTL MedRecord
              </h2>
            )}{" "}
            {/* Reduced text size to 'lg' */}
          </div>
        </div>
        {/* User Profile Section */}
        {isSidebarOpen && (
          <div className="p-4 flex flex-col items-center border-b border-gray-200">
            <img
              src={
                userData?.profile_image ||
                "https://placehold.co/80x80/cccccc/333333?text=👤"
              } // Use uploaded profile image or fallback
              alt="User Profile"
              className="object-cover w-20 h-20 mb-2 border-2 border-gray-300 rounded-md"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src =
                  "https://placehold.co/80x80/cccccc/333333?text=👤"; // fallback in case URL is broken
              }}
            />
            <p className="text-xs text-gray-600 uppercase">{userData?.name}</p>
          </div>
        )}

        <AppSidebarNav
          onNavLinkClick={onCloseSidebar}
          currentPage={currentPage}
          isSidebarOpen={isSidebarOpen}
        />
      </aside>
    </>
  );
};

export default AppSidebar;
