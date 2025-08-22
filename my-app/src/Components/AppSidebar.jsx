// src/Componenets/AppSidebar.jsx
import React from 'react';
import AppSidebarNav from './AppSidebarNav';

const AppSidebar = ({ isSidebarOpen, onCloseSidebar, currentPage }) => {
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
        className={`fixed inset-y-0 left-0 bg-red-700 text-white shadow-xl transform transition-transform duration-300 z-50 md:relative md:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0 w-64' : '-translate-x-full md:w-20'
        }`}
      >
        <div className={`p-4 flex flex-col items-center justify-center border-b border-red-600 ${isSidebarOpen ? 'w-64' : 'w-20'}`}>
          <img
            src="public/MedRecords.png"
            alt="MedRecords Logo"
            className={`rounded-full object-cover mb-2 transition-all duration-300 ${
              isSidebarOpen ? 'w-24 h-24' : 'w-10 h-10'
            }`}
            onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/112x112/ffffff/000000?text=Logo"; }}
          />
          {isSidebarOpen && <h2 className="text-xl font-bold">CPSTL MedRecord </h2>}
        </div>
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
