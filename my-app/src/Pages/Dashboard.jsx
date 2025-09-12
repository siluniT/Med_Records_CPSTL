// src/Pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  BuildingOffice2Icon,
  UserGroupIcon,
  BanknotesIcon,
  TruckIcon,
  CalendarDaysIcon,
  ArrowUpRightIcon,
  ChevronRightIcon,
  UserPlusIcon,
} from '@heroicons/react/24/outline';

import AppSidebar from '../Components/AppSidebar';
import AppHeader from '../Components/AppHeader';
import AppFooter from '../Components/AppFooter';
import LineChartCard from '../Components/LineChartCard';
import NotificationPanel from '../Components/NotificationPanel'; 

const StatCard = ({ icon, title, value, sub }) => {
  const IconComponent = icon;
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center">
        <div className="rounded-lg bg-red-50 text-red-600 p-2 mr-3">
          <IconComponent className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <div className="text-xl font-semibold text-gray-800">{value}</div>
          <div className="text-sm text-gray-600">{title}</div>
        </div>
      </div>
      {sub && <div className="mt-2 text-xs text-gray-500">{sub}</div>}
    </div>
  );
};

const PromoBanner = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  const formattedDate = currentTime.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
  });
  const formattedTime = currentTime.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="relative overflow-hidden rounded-xl p-6 md:p-7 lg:p-8 bg-gradient-to-r from-red-500 to-red-600 text-white shadow-sm">
      <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/10 blur-2xl" />
      <div className="absolute -bottom-12 -left-12 w-48 h-48 rounded-full bg-white/10 blur-3xl" />
      <div className="relative z-10 flex items-center">
        <div className="flex-1">
          <div className="text-2xl md:text-3xl font-bold leading-tight">
            Welcome back!
          </div>
          <div className="mt-2 text-sm text-white/90">
            We hope you have a great day. The latest data is here for you.
          </div>
          <div className="mt-2 flex items-center text-sm text-red-50">
            <CalendarDaysIcon className="w-4 h-4 mr-1 opacity-90" />
            {formattedDate} · {formattedTime}
          </div>
        </div>
        <div className="hidden md:block ml-6">
          <div className="w- h-40 md:w-48 md:h-48 rounded-xl bg-white/15 backdrop-blur-sm border border-white/20 flex items-center justify-center overflow-hidden">
            <img
              src="/doctor.jpg"
              alt="Doctor"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const DoctorsListCard = () => {
  const patients = [
    { name: 'Smith Wright', role: 'Clinical Doctor', status: 'Admitted' },
    { name: 'Emily Stone', role: 'Cardiologist', status: 'In-progress' },
    { name: 'David Kim', role: 'Pediatrician', status: 'In-progress' },
    { name: 'Sara Jones', role: 'Radiologist', status: 'Admitted' },
  ];

  const statusColor = (s) =>
    s === 'Available'
      ? 'bg-emerald-50 text-emerald-700'
      : s === 'On Duty'
      ? 'bg-blue-50 text-blue-700'
      : 'bg-gray-100 text-gray-600';

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-5 py-4 bg-red-500 text-white">
        <div className="text-base font-semibold">Patients List</div>
        <div className="text-xs text-red-100">Quick overview of current patients</div>
      </div>
      <div className="divide-y divide-gray-100">
        {patients.map((patient, i) => (
          <div key={i} className="px-5 py-4 flex items-center">
            <div className="mr-3">
              <div className="w-10 h-10 rounded-full bg-red-100 text-red-700 flex items-center justify-center font-semibold">
                {patient.name.charAt(0)}
              </div>
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-800">{patient.name}</div>
              <div className="text-xs text-gray-500">{patient.condition}</div>
            </div>
            <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusColor(patient.status)}`}>
              {patient.status}
            </span>
          </div>
        ))}
      </div>
      <div className="px-5 py-3 bg-gray-50 text-right">
        <button className="text-xs font-medium text-red-600 hover:text-red-700">View all</button>
      </div>
    </div>
  );
};

function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false); // New state for notifications
  const toggleSidebar = () => setIsSidebarOpen((s) => !s);
  const closeSidebar = () => setIsSidebarOpen(false);
  const toggleNotifications = () => setIsNotificationsOpen((s) => !s); // New function to toggle notifications

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      <AppSidebar isSidebarOpen={isSidebarOpen} onCloseSidebar={closeSidebar} currentPage="Dashboard" />

      <main className="flex-1 flex flex-col overflow-hidden relative"> {/* Add 'relative' class here */}
        <AppHeader
          onMenuToggle={toggleSidebar}
          isSidebarOpen={isSidebarOpen}
          onNotificationToggle={toggleNotifications} // Pass the new toggle function
        />
        {/* Conditionally render the NotificationPanel based on the state */}
        {isNotificationsOpen && <NotificationPanel isOpen={isNotificationsOpen} onClose={toggleNotifications} />}

        <div className="flex-1 overflow-y-auto p-4 lg:p-6">
          <div className="mb-4 flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>
            <Link to="/AddNewPatient" className="bg-red-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-red-700 transition flex items-center">
              <UserPlusIcon className="w-5 h-5 mr-2" />
              Add Patient
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2">
              <PromoBanner />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <StatCard
                icon={BuildingOffice2Icon}
                value="200"
                title="Total Patients"
                sub="Updated today"
              />
              <StatCard
                icon={UserGroupIcon}
                value="126"
                title="New Patients"
                sub="Across all Funtions"
              />
              <StatCard
                icon={UserGroupIcon}
                value="36"
                title="Staff"
                sub="All units"
              />
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2">
              <LineChartCard />
            </div>
            <div className="lg:col-span-1">
              <DoctorsListCard />
            </div>
          </div>
        </div>
        <AppFooter />
      </main>
    </div>
  );
}

export default Dashboard;