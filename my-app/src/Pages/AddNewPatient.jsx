// src/Pages/AddNewPatient.jsx
import React, { useState } from 'react';
import {
  UserCircleIcon,
  ScaleIcon,
  HeartIcon,
  EyeIcon,
  SunIcon,
  ExclamationCircleIcon,
  CheckCircleIcon,
  ClipboardDocumentListIcon,
  BeakerIcon
} from '@heroicons/react/24/outline';

import AppSidebar from '../Components/AppSidebar';
import AppHeader from '../Components/AppHeader';
import AppFooter from '../Components/AppFooter';

// A component to display the multi-step progress bar with icons
const ProgressBar = ({ currentStep, totalSteps, icons }) => {
  const progressBarWidth = `${((currentStep - 1) / (totalSteps - 1)) * 100}%`;

  return (
    <div className="flex flex-col items-center w-full max-w-2xl mx-auto">
      <div className="flex items-center justify-between w-full my-4 text-xs sm:text-sm relative">
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-300 -z-10 transform -translate-y-1/2 rounded-full">
          <div
            className="h-full bg-green-500 transition-all duration-500 ease-in-out rounded-full"
            style={{ width: progressBarWidth }}
          ></div>
        </div>
        {[...Array(totalSteps)].map((_, index) => {
          const stepNumber = index + 1;
          const isCurrentStep = stepNumber === currentStep;
          const isCompleted = stepNumber < currentStep;
          const StepIcon = icons[index];
          const label = ['Demographics', 'Health Metrics', 'Medical History', 'Lifestyle', 'Problems', 'Treatment'][index];

          return (
            <div key={index} className="flex flex-col items-center z-10">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white transition-colors duration-500
                  ${isCurrentStep ? 'bg-red-500' : isCompleted ? 'bg-green-500' : 'bg-gray-400'}`}
              >
                <StepIcon className="w-4 h-4" />
              </div>
              <span className={`mt-2 text-center font-medium w-20 text-xs text-gray-700 transition-colors duration-500
                ${isCompleted || isCurrentStep ? 'text-green-700' : 'text-gray-700'}`}>
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Section header component with icon
const SectionHeader = ({ icon, title }) => {
  const IconComponent = icon;
  return (
    <div className="flex items-center mb-3 pb-2 border-b border-gray-200">
      <IconComponent className="w-5 h-5 mr-2 text-red-500" />
      <h2 className="text-base font-semibold text-gray-800">{title}</h2>
    </div>
  );
};

// The main page component for adding a new patient
function AddNewPatient() {
  const [step, setStep] = useState(1);
  const totalSteps = 6; // Reduced from 8 to 6
  const [formData, setFormData] = useState({
    // Demographics
    registrationNo: '', name: '', epfNo: '', contactNo: '', gender: '', dateOfBirth: '', age: '',
    // Physical Measurements
    height: '', weight: '', bmi: '', waist: '',
    // Vital Signs
    rbs: '', fbs: '', bp: '',
    // Vision
    visionLeft: '', visionRight: '',
    // Medical History
    patientHistory: [], familyHistoryFather: [], familyHistoryMother: [], familyHistorySiblings: [],
    otherPatientConditions: '', otherFatherConditions: '', otherMotherConditions: '', otherSiblingsConditions: '',
    // Lifestyle
    alcoholConsumption: '', smokingHabits: '',
    // Problems
    currentProblems: '',
    // Treatment
    treatmentPlan: '', smokingCessationAdvice: '', alcoholAbuseAdvice: '',
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    if (name.includes('History')) {
      const historyKey = name;
      const condition = e.target.value;
      setFormData((prevData) => ({
        ...prevData,
        [historyKey]: checked
          ? [...prevData[historyKey], condition]
          : prevData[historyKey].filter((c) => c !== condition),
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateStep = (currentStep) => {
    const newErrors = {};

    if (currentStep === 1) {
      if (!formData.name) newErrors.name = 'Patient Name is required.';
      if (!formData.registrationNo) newErrors.registrationNo = 'Registration No. is required.';
      if (!formData.epfNo) newErrors.epfNo = 'EPF No. is required.';
      if (!formData.contactNo) newErrors.contactNo = 'Contact No. is required.';
      if (!formData.gender) newErrors.gender = 'Gender is required.';
      if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of Birth is required.';
      if (!formData.age) newErrors.age = 'Age is required.';
    }

    if (currentStep === 2) {
      // Physical Measurements
      if (!formData.height) newErrors.height = 'Height is required.';
      if (!formData.weight) newErrors.weight = 'Weight is required.';
      if (!formData.bmi) newErrors.bmi = 'BMI is required.';
      if (!formData.waist) newErrors.waist = 'Waist measurement is required.';
      // Vital Signs
      if (!formData.rbs) newErrors.rbs = 'RBS is required.';
      if (!formData.fbs) newErrors.fbs = 'FBS is required.';
      if (!formData.bp) newErrors.bp = 'Blood Pressure is required.';
      // Vision
      if (!formData.visionLeft) newErrors.visionLeft = 'Left eye vision is required.';
      if (!formData.visionRight) newErrors.visionRight = 'Right eye vision is required.';
    }

    if (currentStep === 4) {
      if (!formData.alcoholConsumption) newErrors.alcoholConsumption = 'Alcohol consumption details are required.';
      if (!formData.smokingHabits) newErrors.smokingHabits = 'Smoking habits details are required.';
    }

    if (currentStep === 5) {
      if (!formData.currentProblems) newErrors.currentProblems = 'Current problems description is required.';
    }

    if (currentStep === 6) {
      if (!formData.treatmentPlan) newErrors.treatmentPlan = 'Treatment plan is required.';
      if (!formData.smokingCessationAdvice) newErrors.smokingCessationAdvice = 'Smoking cessation advice is required.';
      if (!formData.alcoholAbuseAdvice) newErrors.alcoholAbuseAdvice = 'Alcohol abuse advice is required.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      if (step < totalSteps) {
        setStep(step + 1);
      } else {
        console.log('Form Submitted:', formData);
        alert('Patient details saved successfully!');
        setStep(1);
        setFormData({
          registrationNo: '', name: '', epfNo: '', contactNo: '', gender: '', dateOfBirth: '', age: '',
          height: '', weight: '', bmi: '', waist: '',
          rbs: '', fbs: '', bp: '',
          visionLeft: '', visionRight: '',
          patientHistory: [], familyHistoryFather: [], familyHistoryMother: [], familyHistorySiblings: [],
          otherPatientConditions: '', otherFatherConditions: '', otherMotherConditions: '', otherSiblingsConditions: '',
          alcoholConsumption: '', smokingHabits: '',
          currentProblems: '',
          treatmentPlan: '', smokingCessationAdvice: '', alcoholAbuseAdvice: '',
        });
        setErrors({});
      }
    }
  };

  const handlePrev = () => {
    if (step > 1) {
      setStep(step - 1);
      setErrors({});
    }
  };

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const progressIcons = [
    UserCircleIcon, HeartIcon, ClipboardDocumentListIcon, SunIcon, ExclamationCircleIcon, CheckCircleIcon
  ];

  const commonMedicalConditions = ['DM', 'HTN', 'Chol', 'IHD', 'CA'];

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      <AppSidebar isSidebarOpen={isSidebarOpen} onCloseSidebar={closeSidebar} currentPage="Add New Patient" />

      <main className="flex-1 flex flex-col overflow-hidden">
        <AppHeader
          onMenuToggle={toggleSidebar}
          isSidebarOpen={isSidebarOpen}
        />

        <div className="flex-1 overflow-y-auto p-4 lg:p-6">
          <div className="bg-white rounded-lg shadow-md p-4 lg:p-6">
            <div className="flex items-center justify-center mb-8">
              <ProgressBar currentStep={step} totalSteps={totalSteps} icons={progressIcons} />
            </div>

            {/* Step 1: Patient Demographics */}
            {step === 1 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                <h1 className="text-xl font-semibold text-gray-800 md:col-span-2 flex items-center">
                  <UserCircleIcon className="w-6 h-6 mr-2 text-red-500" />
                  Patient Demographics
                </h1>
                <div>
                  <label htmlFor="registrationNo" className="block text-xs font-medium text-gray-700">Registration No.</label>
                  <input type="text" id="registrationNo" name="registrationNo" value={formData.registrationNo} onChange={handleChange} className={`mt-1 block w-full border rounded-md shadow-sm p-1 ${errors.registrationNo ? 'border-red-500' : 'border-gray-300'}`} />
                  {errors.registrationNo && <p className="mt-1 text-xs text-red-500">{errors.registrationNo}</p>}
                </div>
                <div>
                  <label htmlFor="name" className="block text-xs font-medium text-gray-700">Name</label>
                  <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} className={`mt-1 block w-full border rounded-md shadow-sm p-1 ${errors.name ? 'border-red-500' : 'border-gray-300'}`} />
                  {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
                </div>
                <div>
                  <label htmlFor="epfNo" className="block text-xs font-medium text-gray-700">EPF No.</label>
                  <input type="text" id="epfNo" name="epfNo" value={formData.epfNo} onChange={handleChange} className={`mt-1 block w-full border rounded-md shadow-sm p-1 ${errors.epfNo ? 'border-red-500' : 'border-gray-300'}`} />
                  {errors.epfNo && <p className="mt-1 text-xs text-red-500">{errors.epfNo}</p>}
                </div>
                <div>
                  <label htmlFor="contactNo" className="block text-xs font-medium text-gray-700">Contact No.</label>
                  <input type="tel" id="contactNo" name="contactNo" value={formData.contactNo} onChange={handleChange} className={`mt-1 block w-full border rounded-md shadow-sm p-1 ${errors.contactNo ? 'border-red-500' : 'border-gray-300'}`} />
                  {errors.contactNo && <p className="mt-1 text-xs text-red-500">{errors.contactNo}</p>}
                </div>
                <div>
                  <label htmlFor="dateOfBirth" className="block text-xs font-medium text-gray-700">Date of Birth</label>
                  <input type="date" id="dateOfBirth" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} className={`mt-1 block w-full border rounded-md shadow-sm p-1 ${errors.dateOfBirth ? 'border-red-500' : 'border-gray-300'}`} />
                  {errors.dateOfBirth && <p className="mt-1 text-xs text-red-500">{errors.dateOfBirth}</p>}
                </div>
                <div>
                  <label htmlFor="age" className="block text-xs font-medium text-gray-700">Age</label>
                  <input type="number" id="age" name="age" value={formData.age} onChange={handleChange} className={`mt-1 block w-full border rounded-md shadow-sm p-1 ${errors.age ? 'border-red-500' : 'border-gray-300'}`} />
                  {errors.age && <p className="mt-1 text-xs text-red-500">{errors.age}</p>}
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-gray-700">Gender</label>
                  <div className={`mt-2 flex items-center space-x-4 ${errors.gender ? 'border border-red-500 p-1 rounded-md' : ''}`}>
                    <div className="flex items-center">
                      <input type="radio" id="female" name="gender" value="Female" checked={formData.gender === 'Female'} onChange={handleChange} className="h-3 w-3 text-red-600 border-gray-300 focus:ring-red-500" />
                      <label htmlFor="female" className="ml-1 text-xs text-gray-700">Female</label>
                    </div>
                    <div className="flex items-center">
                      <input type="radio" id="male" name="gender" value="Male" checked={formData.gender === 'Male'} onChange={handleChange} className="h-3 w-3 text-red-600 border-gray-300 focus:ring-red-500" />
                      <label htmlFor="male" className="ml-1 text-xs text-gray-700">Male</label>
                    </div>
                  </div>
                  {errors.gender && <p className="mt-1 text-xs text-red-500">{errors.gender}</p>}
                </div>
              </div>
            )}

            {/* Step 2: Combined Health Metrics (Physical Measurements, Vital Signs, Vision) */}
            {step === 2 && (
              <div className="space-y-6">
                <h1 className="text-xl font-semibold text-gray-800 flex items-center">
                  <HeartIcon className="w-6 h-6 mr-2 text-red-500" />
                  Health Metrics
                </h1>
                
                {/* Physical Measurements Section */}
                <div>
                  <SectionHeader icon={ScaleIcon} title="Physical Measurements" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                    <div>
                      <label htmlFor="height" className="block text-xs font-medium text-gray-700">Height (cm)</label>
                      <input type="number" id="height" name="height" value={formData.height} onChange={handleChange} className={`mt-1 block w-full border rounded-md shadow-sm p-1 ${errors.height ? 'border-red-500' : 'border-gray-300'}`} />
                      {errors.height && <p className="mt-1 text-xs text-red-500">{errors.height}</p>}
                    </div>
                    <div>
                      <label htmlFor="weight" className="block text-xs font-medium text-gray-700">Weight (kg)</label>
                      <input type="number" id="weight" name="weight" value={formData.weight} onChange={handleChange} className={`mt-1 block w-full border rounded-md shadow-sm p-1 ${errors.weight ? 'border-red-500' : 'border-gray-300'}`} />
                      {errors.weight && <p className="mt-1 text-xs text-red-500">{errors.weight}</p>}
                    </div>
                    <div>
                      <label htmlFor="bmi" className="block text-xs font-medium text-gray-700">BMI</label>
                      <input type="number" id="bmi" name="bmi" value={formData.bmi} onChange={handleChange} className={`mt-1 block w-full border rounded-md shadow-sm p-1 ${errors.bmi ? 'border-red-500' : 'border-gray-300'}`} />
                      {errors.bmi && <p className="mt-1 text-xs text-red-500">{errors.bmi}</p>}
                    </div>
                    <div>
                      <label htmlFor="waist" className="block text-xs font-medium text-gray-700">Waist (cm)</label>
                      <input type="number" id="waist" name="waist" value={formData.waist} onChange={handleChange} className={`mt-1 block w-full border rounded-md shadow-sm p-1 ${errors.waist ? 'border-red-500' : 'border-gray-300'}`} />
                      {errors.waist && <p className="mt-1 text-xs text-red-500">{errors.waist}</p>}
                    </div>
                  </div>
                </div>

                {/* Vital Signs & Lab Results Section */}
                <div>
                  <SectionHeader icon={BeakerIcon} title="Vital Signs & Lab Results" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                    <div>
                      <label htmlFor="rbs" className="block text-xs font-medium text-gray-700">RBS (Random Blood Sugar)</label>
                      <input type="text" id="rbs" name="rbs" value={formData.rbs} onChange={handleChange} className={`mt-1 block w-full border rounded-md shadow-sm p-1 ${errors.rbs ? 'border-red-500' : 'border-gray-300'}`} />
                      {errors.rbs && <p className="mt-1 text-xs text-red-500">{errors.rbs}</p>}
                    </div>
                    <div>
                      <label htmlFor="fbs" className="block text-xs font-medium text-gray-700">FBS (Fasting Blood Sugar)</label>
                      <input type="text" id="fbs" name="fbs" value={formData.fbs} onChange={handleChange} className={`mt-1 block w-full border rounded-md shadow-sm p-1 ${errors.fbs ? 'border-red-500' : 'border-gray-300'}`} />
                      {errors.fbs && <p className="mt-1 text-xs text-red-500">{errors.fbs}</p>}
                    </div>
                    <div>
                      <label htmlFor="bp" className="block text-xs font-medium text-gray-700">BP (Blood Pressure)</label>
                      <input type="text" id="bp" name="bp" value={formData.bp} onChange={handleChange} placeholder="120/80" className={`mt-1 block w-full border rounded-md shadow-sm p-1 ${errors.bp ? 'border-red-500' : 'border-gray-300'}`} />
                      {errors.bp && <p className="mt-1 text-xs text-red-500">{errors.bp}</p>}
                    </div>
                  </div>
                </div>

                {/* Vision Assessment Section */}
                <div>
                  <SectionHeader icon={EyeIcon} title="Vision Assessment" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                    <div>
                      <label htmlFor="visionLeft" className="block text-xs font-medium text-gray-700">Vision: Left Eye</label>
                      <input type="text" id="visionLeft" name="visionLeft" value={formData.visionLeft} onChange={handleChange} className={`mt-1 block w-full border rounded-md shadow-sm p-1 ${errors.visionLeft ? 'border-red-500' : 'border-gray-300'}`} />
                      {errors.visionLeft && <p className="mt-1 text-xs text-red-500">{errors.visionLeft}</p>}
                    </div>
                    <div>
                      <label htmlFor="visionRight" className="block text-xs font-medium text-gray-700">Vision: Right Eye</label>
                      <input type="text" id="visionRight" name="visionRight" value={formData.visionRight} onChange={handleChange} className={`mt-1 block w-full border rounded-md shadow-sm p-1 ${errors.visionRight ? 'border-red-500' : 'border-gray-300'}`} />
                      {errors.visionRight && <p className="mt-1 text-xs text-red-500">{errors.visionRight}</p>}
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Step 3: Medical History */}
            {step === 3 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                <h1 className="text-xl font-semibold text-gray-800 md:col-span-2 flex items-center">
                  <ClipboardDocumentListIcon className="w-6 h-6 mr-2 text-red-500" />
                  Medical History
                </h1>
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Patient History</h3>
                  {commonMedicalConditions.map((condition) => (
                    <div key={condition} className="flex items-center mb-1">
                      <input
                        id={`patient-${condition}`}
                        name="patientHistory"
                        value={condition}
                        type="checkbox"
                        checked={formData.patientHistory.includes(condition)}
                        onChange={handleChange}
                        className="h-3 w-3 text-red-600 border-gray-300 rounded"
                      />
                      <label htmlFor={`patient-${condition}`} className="ml-1 text-xs text-gray-700">{condition}</label>
                    </div>
                  ))}
                  <label htmlFor="otherPatientConditions" className="mt-2 block text-xs font-medium text-gray-700">Other Medical Conditions</label>
                  <textarea id="otherPatientConditions" name="otherPatientConditions" rows="2" value={formData.otherPatientConditions} onChange={handleChange} className="mt-1 block w-full border rounded-md shadow-sm p-1 border-gray-300"></textarea>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Family History</h3>
                  <div className="space-y-2">
                    {['Father', 'Mother', 'Siblings'].map((relation) => (
                      <div key={relation}>
                        <h4 className="font-medium text-xs text-gray-700">{relation}'s Medical History</h4>
                        {commonMedicalConditions.map((condition) => (
                          <div key={`${relation}-${condition}`} className="flex items-center mb-1">
                            <input
                              id={`${relation}-${condition}`}
                              name={`familyHistory${relation}`}
                              value={condition}
                              type="checkbox"
                              checked={formData[`familyHistory${relation}`].includes(condition)}
                              onChange={handleChange}
                              className="h-3 w-3 text-red-600 border-gray-300 rounded"
                            />
                            <label htmlFor={`${relation}-${condition}`} className="ml-1 text-xs text-gray-700">{condition}</label>
                          </div>
                        ))}
                        <label htmlFor={`other${relation}Conditions`} className="mt-1 block text-xs font-medium text-gray-700">Other Conditions</label>
                        <textarea id={`other${relation}Conditions`} name={`other${relation}Conditions`} rows="1" value={formData[`other${relation}Conditions`]} onChange={handleChange} className="mt-1 block w-full border rounded-md shadow-sm p-1 border-gray-300"></textarea>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            {/* Step 4: Lifestyle & Habits */}
            {step === 4 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                <h1 className="text-xl font-semibold text-gray-800 md:col-span-2 flex items-center">
                  <SunIcon className="w-6 h-6 mr-2 text-red-500" />
                  Lifestyle & Habits
                </h1>
                <div>
                  <label htmlFor="alcoholConsumption" className="block text-xs font-medium text-gray-700">Alcohol Consumption</label>
                  <textarea id="alcoholConsumption" name="alcoholConsumption" rows="3" value={formData.alcoholConsumption} onChange={handleChange} placeholder="Describe frequency and amount..." className={`mt-1 block w-full border rounded-md shadow-sm p-1 ${errors.alcoholConsumption ? 'border-red-500' : 'border-gray-300'}`}></textarea>
                  {errors.alcoholConsumption && <p className="mt-1 text-xs text-red-500">{errors.alcoholConsumption}</p>}
                </div>
                <div>
                  <label htmlFor="smokingHabits" className="block text-xs font-medium text-gray-700">Smoking Habits</label>
                  <textarea id="smokingHabits" name="smokingHabits" rows="3" value={formData.smokingHabits} onChange={handleChange} placeholder="Describe frequency and amount..." className={`mt-1 block w-full border rounded-md shadow-sm p-1 ${errors.smokingHabits ? 'border-red-500' : 'border-gray-300'}`}></textarea>
                  {errors.smokingHabits && <p className="mt-1 text-xs text-red-500">{errors.smokingHabits}</p>}
                </div>
              </div>
            )}
            
            {/* Step 5: Current Problems */}
            {step === 5 && (
              <div>
                <h1 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <ExclamationCircleIcon className="w-6 h-6 mr-2 text-red-500" />
                  Current Problems
                </h1>
                <label htmlFor="currentProblems" className="block text-xs font-medium text-gray-700">Details of current health problems (e.g., Increased body weight, Blood sugar issues, Blood pressure issues, Poor vision)</label>
                <textarea id="currentProblems" name="currentProblems" rows="4" value={formData.currentProblems} onChange={handleChange} placeholder="Describe current symptoms and issues..." className={`mt-1 block w-full border rounded-md shadow-sm p-1 ${errors.currentProblems ? 'border-red-500' : 'border-gray-300'}`}></textarea>
                {errors.currentProblems && <p className="mt-1 text-xs text-red-500">{errors.currentProblems}</p>}
              </div>
            )}
            
            {/* Step 6: Treatment Plan */}
            {step === 6 && (
              <div className="space-y-4">
                <h1 className="text-xl font-semibold text-gray-800 flex items-center">
                  <CheckCircleIcon className="w-6 h-6 mr-2 text-red-500" />
                  Treatment Plan / Recommendations
                </h1>
                <div>
                  <label htmlFor="treatmentPlan" className="block text-xs font-medium text-gray-700">Specific plans or recommendations (e.g., Sponge Family, Away of Medical Centre - CPSTL)</label>
                  <textarea id="treatmentPlan" name="treatmentPlan" rows="3" value={formData.treatmentPlan} onChange={handleChange} placeholder="Enter treatment details..." className={`mt-1 block w-full border rounded-md shadow-sm p-1 ${errors.treatmentPlan ? 'border-red-500' : 'border-gray-300'}`}></textarea>
                  {errors.treatmentPlan && <p className="mt-1 text-xs text-red-500">{errors.treatmentPlan}</p>}
                </div>
                <div>
                  <label htmlFor="smokingCessationAdvice" className="block text-xs font-medium text-gray-700">Smoking cessation advice</label>
                  <textarea id="smokingCessationAdvice" name="smokingCessationAdvice" rows="3" value={formData.smokingCessationAdvice} onChange={handleChange} placeholder="Enter advice for smoking cessation..." className={`mt-1 block w-full border rounded-md shadow-sm p-1 ${errors.smokingCessationAdvice ? 'border-red-500' : 'border-gray-300'}`}></textarea>
                  {errors.smokingCessationAdvice && <p className="mt-1 text-xs text-red-500">{errors.smokingCessationAdvice}</p>}
                </div>
                <div>
                  <label htmlFor="alcoholAbuseAdvice" className="block text-xs font-medium text-gray-700">Alcohol abuse advice</label>
                  <textarea id="alcoholAbuseAdvice" name="alcoholAbuseAdvice" rows="3" value={formData.alcoholAbuseAdvice} onChange={handleChange} placeholder="Enter advice for alcohol abuse..." className={`mt-1 block w-full border rounded-md shadow-sm p-1 ${errors.alcoholAbuseAdvice ? 'border-red-500' : 'border-gray-300'}`}></textarea>
                  {errors.alcoholAbuseAdvice && <p className="mt-1 text-xs text-red-500">{errors.alcoholAbuseAdvice}</p>}
                </div>
              </div>
            )}

            <div className="mt-6 flex justify-end space-x-3">
              {step > 1 && (
                <button
                  type="button"
                  onClick={handlePrev}
                  className="px-4 py-1 border border-red-500 text-red-500 text-sm rounded-md hover:bg-red-50 transition-colors duration-200"
                >
                  &lt; PREV
                </button>
              )}
              <button
                type="button"
                onClick={handleNext}
                className="px-4 py-1 bg-red-500 text-white text-sm rounded-md hover:bg-red-600 transition-colors duration-200"
              >
                {step < totalSteps ? 'NEXT >' : 'SUBMIT'}
              </button>
            </div>
          </div>
        </div>

        <AppFooter />
      </main>
    </div>
  );
}

export default AddNewPatient;