// src/Componenets/AppSidebarNav.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, Home, Monitor, Users, BarChart2, ListTodo } from 'lucide-react';

const storeData = localStorage.getItem('userData');
const userData = storeData ? JSON.parse(storeData) : null;
console.log(userData?.role_type);
console.log(userData);

const navItems = [
  { name: 'Dashboard', icon: Home, link: '/Dashboard' },
  { name: 'Monitor Tasks', icon: Monitor, link: '/TaskPerformance' },
  
{ name: 'Manage Patients', icon: Users, link: '/AddNewPatient' },
   

];


const AppSidebarNav = ({ onNavLinkClick, currentPage, isSidebarOpen }) => {
  const [isDataAnalyticsDropdownOpen, setIsDataAnalyticsDropdownOpen] = useState(false);

  const handleLinkClick = () => {
    if (onNavLinkClick) {
      onNavLinkClick();
    }
  };

  const isDataAnalyticsActive = () => {
    const currentPath = window.location.pathname;
    return (
      currentPath === '/ManagePatients' ||
      currentPath === '/ManageTasks' ||
      currentPage === 'Manage Patients' ||
      currentPage === 'Manage Tasks' ||
      currentPage === 'Data Analytics'
    );
  };

  return (
    <nav className="flex-1 px-4 py-6 text-white space-y-2">
      {navItems.map((item) => (
        <Link
          key={item.name}
          to={item.link}
          className={`flex items-center rounded-md transition duration-200 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 ${currentPage === item.name || window.location.pathname === item.link ? 'bg-red-600' : ''} ${isSidebarOpen ? 'px-6 py-6 justify-start' : 'p-4 justify-center'}`}
          aria-current={currentPage === item.name || window.location.pathname === item.link ? 'page' : undefined}
          onClick={handleLinkClick}
        >
          <item.icon className={`w-4 h-4 ${isSidebarOpen ? 'mr-3' : ''}`} />
          {isSidebarOpen && <span className="pl-2">{item.name}</span>}
        </Link>
      ))}

      {/* Data Analytics Dropdown */}
      <div className="relative mt-2">
        <button
          onClick={() => setIsDataAnalyticsDropdownOpen(!isDataAnalyticsDropdownOpen)}
          className={`flex items-center justify-between w-full px-6 py-6 rounded-md transition duration-200 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 ${isDataAnalyticsActive() ? 'bg-red-600' : ''} ${isSidebarOpen ? 'justify-start' : 'justify-center'}`}
          aria-current={isDataAnalyticsActive() ? 'page' : undefined}
        >
          <div className="flex items-center">
            <BarChart2 className={`w-6 h-6 ${isSidebarOpen ? 'mr-3' : ''}`} />
            {isSidebarOpen && <span className="pl-2">Data Analytics</span>}
          </div>
          {isSidebarOpen && <ChevronDown className={`w-4 h-4 transform transition-transform ${isDataAnalyticsDropdownOpen ? 'rotate-180' : ''}`} />}
        </button>
        {isDataAnalyticsDropdownOpen && (
          <div className={`mt-2 bg-red-600 rounded-md shadow-lg ${isSidebarOpen ? 'absolute left-0 w-full z-10' : ''}`}>
            <Link
              to="/ManageProjects"
              className={`block px-4 py-2 text-sm text-white hover:bg-red-500 rounded-md ${window.location.pathname === '/ManageProjects' ? 'bg-red-500' : ''}`}
              onClick={handleLinkClick}
            >
              <span className={isSidebarOpen ? 'pl-2' : 'hidden'}>Manage Projects</span>
            </Link>
            <Link
              to="/ManageTasks"
              className={`block px-4 py-2 text-sm text-white hover:bg-red-500 rounded-md ${window.location.pathname === '/ManageTasks' ? 'bg-red-500' : ''}`}
              onClick={handleLinkClick}
            >
              <span className={isSidebarOpen ? 'pl-2' : 'hidden'}>Manage Tasks</span>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default AppSidebarNav;