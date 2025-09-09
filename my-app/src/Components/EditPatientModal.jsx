// src/Components/EditPatientModal.jsx
import React, { useEffect, useState } from 'react';
import { 
  UserCircleIcon, 
  XMarkIcon, 
  DocumentTextIcon, 
  ExclamationTriangleIcon,
  SunIcon,
  ClipboardDocumentListIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import { CheckCircleIcon, HeartIcon, BeakerIcon } from '@heroicons/react/24/solid';
import { CheckIcon } from '@heroicons/react/24/outline';

const EditPatientModal = ({ patient, isOpen, onClose, onSave }) => {
  const [editedPatient, setEditedPatient] = useState({});

  // Common medical conditions for the medical history table
  const commonMedicalConditions = [
    'Diabetes', 'Hypertension', 'Heart Disease', 'Cancer', 'Stroke'
  ];

  useEffect(() => {
    if (patient) {
      setEditedPatient({
        ...patient,
        // Ensure arrays are properly initialized
        patientHistory: Array.isArray(patient.patientHistory) ? patient.patientHistory : [],
        familyHistoryFather: Array.isArray(patient.familyHistoryFather) ? patient.familyHistoryFather : [],
        familyHistoryMother: Array.isArray(patient.familyHistoryMother) ? patient.familyHistoryMother : [],
        familyHistorySiblings: Array.isArray(patient.familyHistorySiblings) ? patient.familyHistorySiblings : [],
      });
    }
  }, [patient]);

  if (!isOpen || !patient) return null;

  const handleInputChange = (field, value) => {
    setEditedPatient((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle medical history checkboxes
  const handleMedicalHistoryChange = (relation, condition) => {
    const fieldName = relation === 'Patient' ? 'patientHistory' : `familyHistory${relation}`;
    const currentConditions = editedPatient[fieldName] || [];
    
    let updatedConditions;
    if (currentConditions.includes(condition)) {
      updatedConditions = currentConditions.filter(c => c !== condition);
    } else {
      updatedConditions = [...currentConditions, condition];
    }
    
    handleInputChange(fieldName, updatedConditions);
  };

  const handleSave = () => {
    onSave(editedPatient);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-500 to-red-500 text-white p-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <svg className="w-8 h-8 mr-3" viewBox="0 0 24 24" fill="none">
                <path d="M4 7h16M4 12h16M4 17h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <div>
                <h2 className="text-2xl font-bold">Edit Patient Details</h2>
                <p className="text-red-100 text-sm">Editing: {patient.name}</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-red-600 rounded-full transition-colors">
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="overflow-y-auto max-h-[calc(90vh-180px)] p-6">
          {/* Demographics */}
          <div className="mb-6 bg-blue-50 rounded-lg p-4 border border-blue-200">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
              <UserCircleIcon className="w-5 h-5 mr-2 text-blue-600" />
              Edit Demographics
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Registration No.</label>
                <input
                  type="text"
                  value={editedPatient.registrationNo || ''}
                  onChange={(e) => handleInputChange('registrationNo', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={editedPatient.name || ''}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">EPF No.</label>
                <input
                  type="text"
                  value={editedPatient.epfNo || ''}
                  onChange={(e) => handleInputChange('epfNo', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contact No.</label>
                <input
                  type="text"
                  value={editedPatient.contactNo || ''}
                  onChange={(e) => handleInputChange('contactNo', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                <select
                  value={editedPatient.gender || ''}
                  onChange={(e) => handleInputChange('gender', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                <input
                  type="date"
                  value={editedPatient.dateOfBirth || ''}
                  onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Health Metrics */}
          <div className="mb-6 bg-orange-50 rounded-lg p-4 border border-orange-200">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
              <HeartIcon className="w-5 h-5 mr-2 text-orange-600" />
              Edit Health Metrics
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Height (cm)</label>
                <input
                  type="number"
                  value={editedPatient.height || ''}
                  onChange={(e) => handleInputChange('height', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
                <input
                  type="number"
                  value={editedPatient.weight || ''}
                  onChange={(e) => handleInputChange('weight', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">BMI</label>
                <input
                  type="number"
                  step="0.1"
                  value={editedPatient.bmi || ''}
                  onChange={(e) => handleInputChange('bmi', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Waist (cm)</label>
                <input
                  type="number"
                  value={editedPatient.waist || ''}
                  onChange={(e) => handleInputChange('waist', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
            </div>
          </div>

          {/* Vital Signs & Lab Results */}
          <div className="mb-6 bg-purple-50 rounded-lg p-4 border border-purple-200">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
              <BeakerIcon className="w-5 h-5 mr-2 text-purple-600" />
              Edit Vital Signs & Lab Results
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Blood Pressure</label>
                <input
                  type="text"
                  value={editedPatient.bp || ''}
                  onChange={(e) => handleInputChange('bp', e.target.value)}
                  placeholder="120/80"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">RBS (Random Blood Sugar)</label>
                <input
                  type="text"
                  value={editedPatient.rbs || ''}
                  onChange={(e) => handleInputChange('rbs', e.target.value)}
                  placeholder="mg/dL"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">FBS (Fasting Blood Sugar)</label>
                <input
                  type="text"
                  value={editedPatient.fbs || ''}
                  onChange={(e) => handleInputChange('fbs', e.target.value)}
                  placeholder="mg/dL"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
            </div>
            
            {/* Vision Assessment */}
            <div className="border-t border-purple-200 pt-4">
              <h4 className="text-md font-semibold text-gray-700 mb-3 flex items-center">
                <EyeIcon className="w-4 h-4 mr-2 text-purple-600" />
                Vision Assessment
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Vision: Left Eye</label>
                  <input
                    type="text"
                    value={editedPatient.visionLeft || ''}
                    onChange={(e) => handleInputChange('visionLeft', e.target.value)}
                    placeholder="6/6"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Vision: Right Eye</label>
                  <input
                    type="text"
                    value={editedPatient.visionRight || ''}
                    onChange={(e) => handleInputChange('visionRight', e.target.value)}
                    placeholder="6/6"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Medical History */}
          <div className="mb-6 bg-yellow-50 rounded-lg p-4 border border-yellow-200">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
              <ClipboardDocumentListIcon className="w-5 h-5 mr-2 text-yellow-600" />
              Edit Medical History
            </h3>
            
            {/* Medical History Table */}
            <div className="bg-white rounded-lg border border-yellow-200 overflow-hidden mb-4">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-yellow-100">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Relation
                    </th>
                    {commonMedicalConditions.map((condition) => (
                      <th key={condition} className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        {condition}
                      </th>
                    ))}
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Other
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {/* Patient History Row */}
                  <tr className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">Patient</td>
                    {commonMedicalConditions.map((condition) => (
                      <td key={`patient-${condition}`} className="px-4 py-3 text-center">
                        <input
                          type="checkbox"
                          checked={(editedPatient.patientHistory || []).includes(condition)}
                          onChange={() => handleMedicalHistoryChange('Patient', condition)}
                          className="h-4 w-4 text-yellow-600 border-gray-300 rounded focus:ring-yellow-500"
                        />
                      </td>
                    ))}
                    <td className="px-4 py-3">
                      <textarea
                        rows={2}
                        value={editedPatient.otherPatientConditions || ''}
                        onChange={(e) => handleInputChange('otherPatientConditions', e.target.value)}
                        className="w-full border rounded-md px-2 py-1 text-sm border-gray-300 focus:ring-2 focus:ring-yellow-500"
                        placeholder="e.g., Asthma, Allergies"
                      />
                    </td>
                  </tr>
                  
                  {/* Family History Rows */}
                  {['Father', 'Mother', 'Siblings'].map((relation) => (
                    <tr key={relation} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{relation}</td>
                      {commonMedicalConditions.map((condition) => (
                        <td key={`${relation}-${condition}`} className="px-4 py-3 text-center">
                          <input
                            type="checkbox"
                            checked={(editedPatient[`familyHistory${relation}`] || []).includes(condition)}
                            onChange={() => handleMedicalHistoryChange(relation, condition)}
                            className="h-4 w-4 text-yellow-600 border-gray-300 rounded focus:ring-yellow-500"
                          />
                        </td>
                      ))}
                      <td className="px-4 py-3">
                        <textarea
                          rows={2}
                          value={editedPatient[`other${relation}Conditions`] || ''}
                          onChange={(e) => handleInputChange(`other${relation}Conditions`, e.target.value)}
                          className="w-full border rounded-md px-2 py-1 text-sm border-gray-300 focus:ring-2 focus:ring-yellow-500"
                          placeholder="e.g., Heart Disease"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Lifestyle & Habits */}
          <div className="mb-6 bg-green-50 rounded-lg p-4 border border-green-200">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
              <SunIcon className="w-5 h-5 mr-2 text-green-600" />
              Edit Lifestyle & Habits
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Alcohol Consumption</label>
                <textarea
                  rows={3}
                  value={editedPatient.alcoholConsumption || ''}
                  onChange={(e) => handleInputChange('alcoholConsumption', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                  placeholder="Describe frequency and amount..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Smoking Habits</label>
                <textarea
                  rows={3}
                  value={editedPatient.smokingHabits || ''}
                  onChange={(e) => handleInputChange('smokingHabits', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                  placeholder="Describe frequency and amount..."
                />
              </div>
            </div>
          </div>

          {/* Current Problems */}
          <div className="mb-6 bg-red-50 rounded-lg p-4 border border-red-200">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
              <ExclamationTriangleIcon className="w-5 h-5 mr-2 text-red-600" />
              Current Problems
            </h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Current Issues & Symptoms</label>
              <textarea
                rows={4}
                value={editedPatient.currentProblems || ''}
                onChange={(e) => handleInputChange('currentProblems', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                placeholder="Describe current health problems and symptoms..."
              />
            </div>
          </div>

          {/* Screening Tests */}
          <div className="mb-6 bg-indigo-50 rounded-lg p-4 border border-indigo-200">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
              <BeakerIcon className="w-5 h-5 mr-2 text-indigo-600" />
              Edit Screening Tests
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Breast Examination</label>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="breastExamDone"
                      name="breastExamination"
                      value="Done"
                      checked={editedPatient.breastExamination === 'Done'}
                      onChange={(e) => handleInputChange('breastExamination', e.target.value)}
                      className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                    />
                    <label htmlFor="breastExamDone" className="ml-2 text-sm text-gray-700">Done</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="breastExamNotDone"
                      name="breastExamination"
                      value="Not Done"
                      checked={editedPatient.breastExamination === 'Not Done'}
                      onChange={(e) => handleInputChange('breastExamination', e.target.value)}
                      className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                    />
                    <label htmlFor="breastExamNotDone" className="ml-2 text-sm text-gray-700">Not Done</label>
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pap Smear</label>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="papSmearDone"
                      name="papSmear"
                      value="Done"
                      checked={editedPatient.papSmear === 'Done'}
                      onChange={(e) => handleInputChange('papSmear', e.target.value)}
                      className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                    />
                    <label htmlFor="papSmearDone" className="ml-2 text-sm text-gray-700">Done</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="papSmearNotDone"
                      name="papSmear"
                      value="Not Done"
                      checked={editedPatient.papSmear === 'Not Done'}
                      onChange={(e) => handleInputChange('papSmear', e.target.value)}
                      className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                    />
                    <label htmlFor="papSmearNotDone" className="ml-2 text-sm text-gray-700">Not Done</label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Treatment Plan */}
          <div className="mb-6 bg-teal-50 rounded-lg p-4 border border-teal-200">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
              <CheckCircleIcon className="w-5 h-5 mr-2 text-teal-600" />
              Treatment Plan & Recommendations
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Treatment Plan</label>
                <textarea
                  rows={3}
                  value={editedPatient.treatmentPlan || ''}
                  onChange={(e) => handleInputChange('treatmentPlan', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                  placeholder="Enter treatment plan and recommendations..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Smoking Cessation Advice</label>
                <textarea
                  rows={3}
                  value={editedPatient.smokingCessationAdvice || ''}
                  onChange={(e) => handleInputChange('smokingCessationAdvice', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                  placeholder="Enter advice for smoking cessation..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Alcohol Abuse Advice</label>
                <textarea
                  rows={3}
                  value={editedPatient.alcoholAbuseAdvice || ''}
                  onChange={(e) => handleInputChange('alcoholAbuseAdvice', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                  placeholder="Enter advice for alcohol abuse..."
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex justify-between items-center border-t">
          <div className="text-sm text-gray-500">* Changes will be saved when you click Save</div>
          <div className="flex space-x-3">
            <button 
              onClick={onClose} 
              className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-gradient-to-r from-red-500 to-red-500 text-white rounded-lg hover:from-red-600 hover:to-red-600 transition-colors flex items-center font-medium shadow-lg"
            >
              <CheckIcon className="w-4 h-4 mr-2" />
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditPatientModal;