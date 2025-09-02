// src/Pages/ManagePatients.jsx
import React, { useEffect, useState } from 'react';
import {
  UserCircleIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  PhoneIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';

import AppSidebar from '../Components/AppSidebar';
import AppHeader from '../Components/AppHeader';
import AppFooter from '../Components/AppFooter';
import ViewPatientModal from '../Components/ViewPatientModal';
import EditPatientModal from '../Components/EditPatientModal';

// Status Badge Component
const StatusBadge = ({ status }) => {
  const getStatusStyles = () => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Deactivate':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'In treatment':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusStyles()}`}>
      {status}
    </span>
  );
};

function ManagePatients() {
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const patientsPerPage = 10;

  // Determine patient status (base/derived)
  const determinePatientStatus = (patient) => {
    if (patient.currentProblems && patient.currentProblems.length > 50) {
      return 'Deactivate';
    } else if (patient.treatmentPlan && patient.treatmentPlan.length > 0) {
      return 'In treatment';
    }
    return 'Active';
  };

  // Load patients from localStorage
  useEffect(() => {
    const storedPatients = JSON.parse(localStorage.getItem('patients') || '[]');
    const patientsWithStatus = storedPatients.map((patient) => {
      const status = patient.manualStatus || determinePatientStatus(patient);
      return { ...patient, status };
    });
    setPatients(patientsWithStatus);
    setFilteredPatients(patientsWithStatus);
  }, []);

  // Calculate age
  const calculateAge = (dob) => {
    if (!dob) return '—';
    const birthDate = new Date(dob);
    if (isNaN(birthDate.getTime())) return '—';
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  // Search and filter
  useEffect(() => {
    let filtered = patients;

    if (searchTerm) {
      filtered = filtered.filter((patient) =>
        (patient.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (patient.registrationNo || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (patient.epfNo || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (patient.contactNo || '').includes(searchTerm)
      );
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter((patient) => patient.status === filterStatus);
    }

    setFilteredPatients(filtered);
    setCurrentPage(1);
  }, [searchTerm, filterStatus, patients]);

  // Pagination
  const indexOfLastPatient = currentPage * patientsPerPage;
  const indexOfFirstPatient = indexOfLastPatient - patientsPerPage;
  const currentPatients = filteredPatients.slice(indexOfFirstPatient, indexOfLastPatient);
  const totalPages = Math.ceil(filteredPatients.length / patientsPerPage);

  // Actions
  const handleView = (patient) => {
    setSelectedPatient(patient);
    setIsViewModalOpen(true);
  };

  const handleEdit = (patient) => {
    setSelectedPatient(patient);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = (editedPatient) => {
    const status = editedPatient.manualStatus || determinePatientStatus(editedPatient);
    const updatedPatients = patients.map((p) =>
      p.id === editedPatient.id ? { ...editedPatient, status, lastUpdated: new Date().toISOString() } : p
    );

    setPatients(updatedPatients);
    localStorage.setItem('patients', JSON.stringify(updatedPatients));
    setSelectedPatient({ ...editedPatient, status });
    alert('Patient information updated successfully!');
  };

  const handleDelete = (patientId) => {
    if (window.confirm('Are you sure you want to delete this patient record?')) {
      const updatedPatients = patients.filter((p) => p.id !== patientId);
      setPatients(updatedPatients);
      localStorage.setItem('patients', JSON.stringify(updatedPatients));
    }
  };

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  // Row-by-row status toggle (On = Active/In treatment, Off = Deactivate)
  const handleToggleRowStatus = (patientId) => {
    const updated = patients.map((p) => {
      if (p.id !== patientId) return p;

      const current = p.manualStatus || determinePatientStatus(p);
      let nextStatus;
      if (current === 'Deactivate') {
        nextStatus = p.treatmentPlan && p.treatmentPlan.length > 0 ? 'In treatment' : 'Active';
      } else {
        nextStatus = 'Deactivate';
      }
      return {
        ...p,
        manualStatus: nextStatus, // persist manual override
        status: nextStatus,       // display status
        lastUpdated: new Date().toISOString(),
      };
    });

    setPatients(updated);
    localStorage.setItem('patients', JSON.stringify(updated));
  };

  // Small toggle UI
  const RowToggle = ({ on, onClick, title }) => (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={onClick}
      title={title}
      className={`relative inline-flex h-5 w-10 items-center rounded-full border transition-colors ${
        on ? 'bg-green-500 border-green-600' : 'bg-red-500 border-red-600'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
          on ? 'translate-x-5' : 'translate-x-1'
        }`}
      />
    </button>
  );

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      <AppSidebar isSidebarOpen={isSidebarOpen} onCloseSidebar={closeSidebar} currentPage="Manage Patients" />

      <main className="flex-1 flex flex-col overflow-hidden">
        <AppHeader onMenuToggle={toggleSidebar} isSidebarOpen={isSidebarOpen} />

        <div className="flex-1 overflow-y-auto p-4 lg:p-6">
          <div className="bg-white rounded-lg shadow-md">
            {/* Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                <h1 className="text-2xl font-semibold text-gray-800 flex items-center">
                  <UserCircleIcon className="w-8 h-8 mr-3 text-red-500" />
                  Manage Patients
                </h1>
                <div className="mt-4 md:mt-0 flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Total Patients:</span>
                  <span className="text-lg font-semibold text-red-600">{patients.length}</span>
                </div>
              </div>

              {/* Search & Filter */}
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search by name, registration no, EPF no, or contact..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                    <MagnifyingGlassIcon className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <FunnelIcon className="w-5 h-5 text-gray-500" />
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option value="all">All Status</option>
                    {/* Optional: add Active here if you want to filter Active explicitly */}
                    {/* <option value="Active">Active</option> */}
                    <option value="Deactivate">Deactivate</option>
                    <option value="In treatment">In-treatment</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              {currentPatients.length > 0 ? (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reg. No</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient Info</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Age/Gender</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Updated</th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentPatients.map((patient) => {
                      const isOn = patient.status !== 'Deactivate';
                      return (
                        <tr key={patient.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {patient.registrationNo}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{patient.name}</div>
                              <div className="text-sm text-gray-500">EPF: {patient.epfNo}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center text-sm text-gray-900">
                              <PhoneIcon className="w-4 h-4 mr-1 text-gray-400" />
                              {patient.contactNo}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {patient.dateOfBirth ? `${calculateAge(patient.dateOfBirth)} yrs` : '—'} / {patient.gender || '—'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              <StatusBadge status={patient.status} />
                              <RowToggle
                                on={isOn}
                                onClick={() => handleToggleRowStatus(patient.id)}
                                title={isOn ? 'Toggle OFF (Deactivate)' : 'Toggle ON (Active/In treatment)'}
                              />
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(patient.lastUpdated || Date.now()).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <div className="flex items-center justify-center space-x-2">
                              <button
                                onClick={() => handleView(patient)}
                                className="p-1 text-blue-600 hover:bg-blue-100 rounded transition-colors"
                                title="View Details"
                              >
                                <EyeIcon className="w-5 h-5" />
                              </button>
                              <button
                                onClick={() => handleEdit(patient)}
                                className="p-1 text-yellow-600 hover:bg-yellow-100 rounded transition-colors"
                                title="Edit"
                              >
                                <PencilIcon className="w-5 h-5" />
                              </button>
                              <button
                                onClick={() => handleDelete(patient.id)}
                                className="p-1 text-red-600 hover:bg-red-100 rounded transition-colors"
                                title="Delete"
                              >
                                <TrashIcon className="w-5 h-5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              ) : (
                <div className="text-center py-12">
                  <UserCircleIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-600">No patients found</p>
                  <p className="mt-1 text-xs text-gray-500">
                    {searchTerm || filterStatus !== 'all'
                      ? 'Try adjusting your search or filter criteria'
                      : 'Add a new patient to get started'}
                  </p>
                </div>
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    Showing {indexOfFirstPatient + 1} to {Math.min(indexOfLastPatient, filteredPatients.length)} of {filteredPatients.length} patients
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className={`p-2 rounded ${
                        currentPage === 1
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                      }`}
                    >
                      <ChevronLeftIcon className="w-5 h-5" />
                    </button>

                    {[...Array(totalPages)].map((_, index) => {
                      const page = index + 1;
                      if (page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) {
                        return (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`px-3 py-1 rounded ${
                              currentPage === page ? 'bg-red-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                            }`}
                          >
                            {page}
                          </button>
                        );
                      } else if (page === currentPage - 2 || page === currentPage + 2) {
                        return (
                          <span key={page} className="px-1">
                            ...
                          </span>
                        );
                      }
                      return null;
                    })}

                    <button
                      onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className={`p-2 rounded ${
                        currentPage === totalPages
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                      }`}
                    >
                      <ChevronRightIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <AppFooter />
      </main>

      {/* View Modal */}
      <ViewPatientModal
        patient={selectedPatient}
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        onEdit={() => {
          setIsViewModalOpen(false);
          setIsEditModalOpen(true);
        }}
      />

      {/* Edit Modal */}
      <EditPatientModal
        patient={selectedPatient}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveEdit}
      />
    </div>
  );
}

export default ManagePatients;