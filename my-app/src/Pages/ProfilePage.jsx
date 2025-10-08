// src/Pages/ProfilePage.jsx
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import AppSidebar from "../Components/AppSidebar";
import AppHeader from "../Components/AppHeader";
import AppFooter from "../Components/AppFooter";

function ProfilePage() {
  const [userProfile, setUserProfile] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  useEffect(() => {
    //  Load user data
    const storedUserData = localStorage.getItem("userData");
    if (storedUserData) {
      try {
        const parsedData = JSON.parse(storedUserData);
        setUserProfile(parsedData.user || parsedData);
      } catch (error) {
        console.error("Error parsing user data from localStorage:", error);
        setUserProfile(null);
      }
    } else {
      // Redirect if no user data
      navigate("/login");
    }

    //  Load profile image
    const storedProfileImage = localStorage.getItem("profileImage");
    if (storedProfileImage) {
      setProfileImage(storedProfileImage);
    }

    //  Sync changes between tabs
    const handleStorageChange = (event) => {
      if (event.key === "profileImage") {
        setProfileImage(event.newValue);
      }
      if (event.key === "userData") {
        try {
          const parsedData = JSON.parse(event.newValue);
          setUserProfile(parsedData.user || parsedData);
        } catch (error) {
          console.error("Error parsing updated user data:", error);
          setUserProfile(null);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [navigate]);

  const defaultPlaceholderImage =
    "https://placehold.co/150x150/E0E7FF/4338CA?text=User";
  const currentProfileImageSrc =
    profileImage || userProfile?.profile_image || defaultPlaceholderImage;

  //  Handle new image upload & save to localStorage
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Image = reader.result;

        // Save separately for ProfilePage
        setProfileImage(base64Image);
        localStorage.setItem("profileImage", base64Image);

        // Also update inside userData
        const storedUserData = localStorage.getItem("userData");
        if (storedUserData) {
          const parsedData = JSON.parse(storedUserData);
          parsedData.profile_image = base64Image;
          localStorage.setItem("userData", JSON.stringify(parsedData));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Reusable detail row
  const DetailRow = ({ label, value }) => (
    <p className="flex justify-between items-start">
      <span className="font-medium text-gray-600 mr-2">{label}:</span>
      <span className="text-gray-800 text-right flex-1 break-words">
        {value || "N/A"}
      </span>
    </p>
  );

  // If profile not loaded
  if (!userProfile) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100 p-6">
        <div className="bg-white p-8 rounded-lg shadow-xl text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Loading Profile...
          </h2>
          <p className="text-gray-600 mb-6">
            If you are not redirected, please log in.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      <AppSidebar
        isSidebarOpen={isSidebarOpen}
        onCloseSidebar={() => setIsSidebarOpen(false)}
        currentPage="Profile"
      />
      <main className="flex-1 flex flex-col overflow-hidden">
        <AppHeader
          onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)}
          isSidebarOpen={isSidebarOpen}
        />
        <div className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          <div className="w-full max-w-7xl mx-auto p-4 bg-white rounded-xl shadow-lg">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center tracking-tight">
              Profile
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
              {/* Left Column: Profile Picture & Shortcuts */}
              <div className="md:col-span-1 flex flex-col items-center p-4 border border-gray-200 rounded-lg bg-gray-50 shadow-sm">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-blue-300 shadow-md mb-4">
                  <img
                    src={currentProfileImageSrc}
                    alt="User Profile"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = defaultPlaceholderImage;
                    }}
                  />
                </div>
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  style={{ display: "none" }}
                />
                <button
                  onClick={triggerFileInput}
                  className="mt-2 mb-4 px-4 py-2 bg-blue-500 text-white text-sm font-semibold rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition-colors duration-200"
                >
                  Change Profile Picture
                </button>

                <h3 className="text-xl font-semibold text-gray-800 mb-1">
                  {userProfile.name || userProfile.name || "User Name"}
                </h3>

                {/* Shortcuts Section */}
                <div className="w-full mt-6">
                  <h4 className="text-lg font-semibold text-gray-700 mb-3 border-b pb-2">
                    Shortcuts
                  </h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex justify-between items-center p-2 bg-white rounded-md shadow-sm hover:bg-gray-100 cursor-pointer">
                      <span>Add Past Employment</span>{" "}
                      <span className="text-blue-600 font-bold">1</span>
                    </li>
                    <li className="flex justify-between items-center p-2 bg-white rounded-md shadow-sm hover:bg-gray-100 cursor-pointer">
                      <span>Add Leave Request</span>{" "}
                      <span className="text-blue-600 font-bold">3</span>
                    </li>
                    <li className="flex justify-between items-center p-2 bg-white rounded-md shadow-sm hover:bg-gray-100 cursor-pointer">
                      <span>Add Expense Report</span>{" "}
                      <span className="text-blue-600 font-bold">1</span>
                    </li>
                    <li className="flex justify-between items-center p-2 bg-white rounded-md shadow-sm hover:bg-gray-100 cursor-pointer">
                      <span>Add Internal Employment</span>{" "}
                      <span className="text-blue-600 font-bold">0</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Right Columns: Personal & Account */}
              <div className="md:col-span-2 grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Personal Information */}
                <div className="p-4 border border-gray-200 rounded-lg bg-gray-50 shadow-sm col-span-1 lg:col-span-2">
                  <h4 className="text-lg font-semibold text-gray-700 mb-3 border-b pb-2">
                    Personal Information
                  </h4>
                  <div className="space-y-2 text-sm text-gray-700">
                    <DetailRow
                      label="EPF Number"
                      value={userProfile.epfNumber || userProfile.username}
                    />
                    <DetailRow label="User ID" value={userProfile.id} />
                    <DetailRow
                      label="Department"
                      value={userProfile?.department || "Health"}
                    />
                    <DetailRow
                      label="Name"
                      value={
                        userProfile.Name ||
                        userProfile.name?.split(" ")[0] ||
                        "N/A"
                      }
                    />
                  </div>
                </div>

                {/* Account Information */}
                <div className="p-4 border border-gray-200 rounded-lg bg-gray-50 shadow-sm col-span-1 lg:col-span-2">
                  <h4 className="text-lg font-semibold text-gray-700 mb-3">
                    Account Information
                  </h4>
                  <div className="space-y-2 text-sm text-gray-700">
                    <DetailRow
                      label="Status"
                      value={
                        <span className="text-green-600 font-semibold">
                          {userProfile.activestatus ? "Active" : "Inactive"}
                        </span>
                      }
                    />
                    <DetailRow
                      label="Role"
                      value={userProfile.role_type || "Doctor"}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Back Button */}
            <div className="mt-8 pt-6 border-gray-200 flex justify-end">
              <button
                onClick={() => navigate(-1)}
                className="px-8 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
              >
                Back
              </button>
            </div>
          </div>
        </div>
        <AppFooter />
      </main>
    </div>
  );
}

export default ProfilePage;
