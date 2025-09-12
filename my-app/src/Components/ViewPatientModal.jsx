// src/Components/ViewPatientModal.jsx
import React from 'react';
import {
  UserCircleIcon,
  EyeIcon,
  XMarkIcon,
  ArrowDownTrayIcon,
  ClipboardDocumentListIcon,
  CheckCircleIcon,
  HeartIcon,
  BeakerIcon,
  ExclamationTriangleIcon,
  SunIcon,
} from '@heroicons/react/24/outline';
import { PDFDownloadLink } from '@react-pdf/renderer';
import PatientReport from './PatientReport';

const ViewPatientModal = ({ patient, isOpen, onClose }) => {
  if (!isOpen || !patient) return null;

  const calculateAge = (dob) => {
    if (!dob) return '';
    const birthDate = new Date(dob);
    if (isNaN(birthDate.getTime())) return '';
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const age = calculateAge(patient.dateOfBirth);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <EyeIcon className="w-8 h-8 mr-3" />
              <div>
                <h2 className="text-2xl font-bold">View Patient Details</h2>
                <p className="text-red-100 text-sm">
                  {patient.name} - {patient.registrationNo}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button onClick={onClose} className="p-2 hover:bg-red-700 rounded-full transition-colors">
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="overflow-y-auto max-h-[calc(90vh-180px)] p-6">
          {/* Demographics */}
          <div className="mb-6 bg-blue-50 rounded-xl p-6 border border-blue-200">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <UserCircleIcon className="w-6 h-6 mr-2 text-blue-600" />
              Patient Demographics
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-gray-500">Registration No.</p>
                <p className="font-semibold text-gray-900">{patient.registrationNo || '—'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Full Name</p>
                <p className="font-semibold text-gray-900">{patient.name || '—'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">EPF No.</p>
                <p className="font-semibold text-gray-900">{patient.epfNo || '—'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Contact No.</p>
                <p className="font-semibold text-gray-900">{patient.contactNo || '—'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Gender</p>
                <p className="font-semibold text-gray-900">{patient.gender || '—'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Date of Birth</p>
                <p className="font-semibold text-gray-900">
                  {patient.dateOfBirth ? new Date(patient.dateOfBirth).toLocaleDateString() : '—'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Age</p>
                <p className="font-semibold text-gray-900">
                  {age ? `${age} years` : '—'}
                </p>
              </div>
            </div>
          </div>

          {/* Health Metrics */}
          <div className="mb-6 bg-orange-50 rounded-xl p-6 border border-orange-200">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <HeartIcon className="w-6 h-6 mr-2 text-red-500" />
              Health Metrics
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <p className="text-sm text-gray-500">Height</p>
                <p className="font-semibold text-gray-900">{patient.height ? `${patient.height} cm` : '—'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Weight</p>
                <p className="font-semibold text-gray-900">{patient.weight ? `${patient.weight} kg` : '—'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">BMI</p>
                <p className="font-semibold text-gray-900">{patient.bmi || '—'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Waist</p>
                <p className="font-semibold text-gray-900">{patient.waist ? `${patient.waist} cm` : '—'}</p>
              </div>
            </div>
          </div>

          {/* Vital Signs */}
          <div className="mb-6 bg-purple-50 rounded-xl p-6 border border-purple-200">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
              <BeakerIcon className="w-5 h-5 mr-2 text-purple-600" />
              Vital Signs & Lab Results
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
              <div>
                <p className="text-sm text-gray-500">Blood Pressure</p>
                <p className="font-semibold text-gray-900">{patient.bp || '—'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">RBS</p>
                <p className="font-semibold text-gray-900">{patient.rbs || '—'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">FBS</p>
                <p className="font-semibold text-gray-900">{patient.fbs || '—'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Vision (Left)</p>
                <p className="font-semibold text-gray-900">{patient.visionLeft || '—'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Vision (Right)</p>
                <p className="font-semibold text-gray-900">{patient.visionRight || '—'}</p>
              </div>
            </div>
          </div>

          {/* Medical History */}
          <div className="mb-6 bg-yellow-50 rounded-xl p-6 border border-yellow-200">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
              <ClipboardDocumentListIcon className="w-5 h-5 mr-2 text-yellow-600" />
              Medical History
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500 font-medium">Patient History</p>
                <p className="font-semibold text-gray-900">
                  {Array.isArray(patient.patientHistory) && patient.patientHistory.length > 0
                    ? patient.patientHistory.join(', ')
                    : '—'}
                </p>
                {patient.otherPatientConditions && (
                  <p className="text-sm text-gray-700 mt-1">Other: {patient.otherPatientConditions}</p>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-500 font-medium">Father's History</p>
                  <p className="font-semibold text-gray-900">
                    {Array.isArray(patient.familyHistoryFather) && patient.familyHistoryFather.length > 0
                      ? patient.familyHistoryFather.join(', ')
                      : '—'}
                  </p>
                  {patient.otherFatherConditions && (
                    <p className="text-sm text-gray-700 mt-1">Other: {patient.otherFatherConditions}</p>
                  )}
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Mother's History</p>
                  <p className="font-semibold text-gray-900">
                    {Array.isArray(patient.familyHistoryMother) && patient.familyHistoryMother.length > 0
                      ? patient.familyHistoryMother.join(', ')
                      : '—'}
                  </p>
                  {patient.otherMotherConditions && (
                    <p className="text-sm text-gray-700 mt-1">Other: {patient.otherMotherConditions}</p>
                  )}
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Siblings' History</p>
                  <p className="font-semibold text-gray-900">
                    {Array.isArray(patient.familyHistorySiblings) && patient.familyHistorySiblings.length > 0
                      ? patient.familyHistorySiblings.join(', ')
                      : '—'}
                  </p>
                  {patient.otherSiblingsConditions && (
                    <p className="text-sm text-gray-700 mt-1">Other: {patient.otherSiblingsConditions}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Lifestyle & Habits */}
          <div className="mb-6 bg-green-50 rounded-xl p-6 border border-green-200">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
              <SunIcon className="w-5 h-5 mr-2 text-green-600" />
              Lifestyle & Habits
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-500 font-medium">Alcohol Consumption</p>
                <p className="font-semibold text-gray-900 whitespace-pre-line">
                  {patient.alcoholConsumption || '—'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Smoking Habits</p>
                <p className="font-semibold text-gray-900 whitespace-pre-line">
                  {patient.smokingHabits || '—'}
                </p>
              </div>
            </div>
          </div>

          {/* Current Problems */}
          <div className="mb-6 bg-red-50 rounded-xl p-6 border border-red-200">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
              <ExclamationTriangleIcon className="w-5 h-5 mr-2 text-red-600" />
              Current Problems
            </h3>
            <div>
              <p className="text-sm text-gray-500 font-medium">Current Issues & Symptoms</p>
              <p className="font-semibold text-gray-900 whitespace-pre-line">
                {patient.currentProblems || '—'}
              </p>
            </div>
          </div>

          {/* Screening Tests */}
          <div className="mb-6 bg-indigo-50 rounded-xl p-6 border border-indigo-200">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
              <BeakerIcon className="w-5 h-5 mr-2 text-indigo-600" />
              Screening Tests
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-500 font-medium">Breast Examination</p>
                <p className="font-semibold text-gray-900">
                  {patient.breastExamination || '—'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Pap Smear</p>
                <p className="font-semibold text-gray-900">
                  {patient.papSmear || '—'}
                </p>
              </div>
            </div>
          </div>

          {/* Treatment Plan */}
          <div className="mb-6 bg-teal-50 rounded-xl p-6 border border-teal-200">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
              <CheckCircleIcon className="w-5 h-5 mr-2 text-teal-600" />
              Treatment Plan & Recommendations
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500 font-medium">Treatment Plan</p>
                <p className="font-semibold text-gray-900 whitespace-pre-line">
                  {patient.treatmentPlan || '—'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Smoking Cessation Advice</p>
                <p className="font-semibold text-gray-900 whitespace-pre-line">
                  {patient.smokingCessationAdvice || '—'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Alcohol Abuse Advice</p>
                <p className="font-semibold text-gray-900 whitespace-pre-line">
                  {patient.alcoholAbuseAdvice || '—'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex justify-between items-center border-t">
          <div className="text-sm text-gray-500">View patient information</div>
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
            >
              Close
            </button>
            <PDFDownloadLink
              document={<PatientReport patient={patient} />}
              fileName={`Medical_Report_${patient.registrationNo}.pdf`}
            >
              {({ loading }) =>
                loading ? (
                  'Loading document...'
                ) : (
                  <button className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center">
                    <ArrowDownTrayIcon className="w-4 h-4 mr-2" />
                    Export PDF
                  </button>
                )
              }
            </PDFDownloadLink>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewPatientModal;