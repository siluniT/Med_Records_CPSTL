// src/Pages/Dashboard.jsx
import React, { useMemo, useState } from 'react';
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

// Small stat card
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

// Red promo banner
const PromoBanner = () => (
  <div className="relative overflow-hidden rounded-xl p-6 md:p-7 lg:p-8 bg-gradient-to-r from-red-500 to-red-600 text-white shadow-sm">
    <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/10 blur-2xl" />
    <div className="absolute -bottom-12 -left-12 w-48 h-48 rounded-full bg-white/10 blur-3xl" />
    <div className="relative z-10 flex items-center">
      <div className="flex-1">
        <div class="text-2xl md:text-3xl font-bold leading-tight">
          Welcome back!
        </div>
       <div class="mt-2 text-sm text-white/90">
          We hope you have a great day. The latest data is here for you.
        </div>
        <div className="mt-2 flex items-center text-sm text-red-50">
          <CalendarDaysIcon className="w-4 h-4 mr-1 opacity-90" />
          29 Nov · 20:00 PM
        </div>
        
      </div>
      <div className="hidden md:block ml-6">
        <div className="w-40 h-40 md:w-48 md:h-48 rounded-xl bg-white/15 backdrop-blur-sm border border-white/20 flex items-center justify-center overflow-hidden">
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

// Simple responsive SVG line chart (no dependencies)
const LineChartCard = () => {
  const data = [120, 180, 150, 220, 300, 260, 340, 320, 380, 360, 420, 410]; // visits per month (sample)
  const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const { pathD, areaD, points } = useMemo(() => {
    const w = 680;
    const h = 240;
    const padX = 24;
    const padY = 24;
    const innerW = w - padX * 2;
    const innerH = h - padY * 2;

    const maxY = Math.max(...data) * 1.1;
    const stepX = innerW / (data.length - 1);

    const pts = data.map((val, idx) => {
      const x = padX + idx * stepX;
      const y = padY + (innerH - (val / maxY) * innerH);
      return { x, y, val };
    });

    const d = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x},${p.y}`).join(' ');
    const area = `${d} L ${pts[pts.length - 1].x},${h - padY} L ${pts[0].x},${h - padY} Z`;

    return { pathD: d, areaD: area, points: pts };
  }, [data]);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
        <div>
          <div className="text-base font-semibold text-gray-800">Medical center Visits Statistics</div>
          <div className="text-xs text-gray-500">Visits over the last 12 months</div>
        </div>
        <div className="flex items-center text-emerald-600 text-xs font-medium">
          <ArrowUpRightIcon className="w-4 h-4 mr-1" />
          +8.2%
        </div>
      </div>
      <div className="px-2 py-4 md:px-4">
        <svg viewBox="0 0 680 240" className="w-full h-56">
          {/* Grid lines */}
          <g stroke="#e5e7eb" strokeWidth="1">
            <line x1="24" y1="40" x2="656" y2="40" />
            <line x1="24" y1="100" x2="656" y2="100" />
            <line x1="24" y1="160" x2="656" y2="160" />
            <line x1="24" y1="216" x2="656" y2="216" />
          </g>
          {/* Area */}
          <path d={areaD} fill="url(#areaFill)" />
          {/* Line */}
          <path d={pathD} fill="none" stroke="#ef4444" strokeWidth="2.5" />
          {/* Points */}
          {points.map((p, i) => (
            <g key={i}>
              <circle cx={p.x} cy={p.y} r="3.5" fill="#ef4444" />
            </g>
          ))}
          {/* Gradients */}
          <defs>
            <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ef4444" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#ef4444" stopOpacity="0.02" />
            </linearGradient>
          </defs>
        </svg>
        {/* X labels */}
        <div className="px-4 grid grid-cols-12 text-[10px] text-gray-500 -mt-2">
          {labels.map((m, i) => (
            <div className="text-center" key={m + i}>
              {m}
            </div>
          ))}
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
    { name: 'Sara Jones', role: 'Radiologist', status: ' Admitted' },
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
  const toggleSidebar = () => setIsSidebarOpen((s) => !s);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      <AppSidebar isSidebarOpen={isSidebarOpen} onCloseSidebar={closeSidebar} currentPage="Dashboard" />

      <main className="flex-1 flex flex-col overflow-hidden">
        <AppHeader onMenuToggle={toggleSidebar} isSidebarOpen={isSidebarOpen} />

        <div className="flex-1 overflow-y-auto p-4 lg:p-6">
          {/* Page title and "Add Patient" button */}
          <div className="mb-4 flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>
            {/* The Link component handles navigation without a full page reload */}
            <Link to="/AddNewPatient" className="bg-red-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-red-700 transition flex items-center">
              <UserPlusIcon className="w-5 h-5 mr-2" />
              Add Patient
            </Link>
          </div>

          {/* Top row: Promo + Stats */}
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

          {/* Middle row: Chart + Doctors list */}
          <div className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2">
              <LineChartCard />
            </div>
            <div className="lg:col-span-1">
              <DoctorsListCard />
            </div>
          </div>

          {/* Quick actions */}
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 text-left hover:shadow-md transition">
              <div className="flex items-center">
                <div className="rounded-lg bg-red-50 text-red-600 p-2 mr-3">
                  <CalendarDaysIcon className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-800">Schedule</div>
                  <div className="text-xs text-gray-500">Create or view appointments</div>
                </div>
              </div>
            </button>
            <button className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 text-left hover:shadow-md transition">
              <div className="flex items-center">
                <div className="rounded-lg bg-red-50 text-red-600 p-2 mr-3">
                  <ArrowUpRightIcon className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-800">Reports</div>
                  <div className="text-xs text-gray-500">Insights and analytics</div>
                </div>
              </div>
            </button>
            <button className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 text-left hover:shadow-md transition">
              <div className="flex items-center">
                <div className="rounded-lg bg-red-50 text-red-600 p-2 mr-3">
                  <TruckIcon className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-800">Ambulance</div>
                  <div className="text-xs text-gray-500">Dispatch and tracking</div>
                </div>
              </div>
            </button>
          </div>
        </div>

        <AppFooter />
      </main>
    </div>
  );
}

export default Dashboard;