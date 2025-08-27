import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Menu, X } from 'lucide-react';
import NotificationPanel from './NotificationPanel';

// Removed the old import and defined the path to the new image
const defaultPublicProfileIcon = '/pro icon.png';

const AppHeader = ({ onMenuToggle, isSidebarOpen }) => {
  const [userData, setUserData] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [profileImage, setProfileImage] = useState(null);
  const dropdownRef = useRef(null);
  const notificationRef = useRef(null);

  const navigate = useNavigate();

  useEffect(() => {
    const storedData = localStorage.getItem('userData');
    if (storedData) {
      setUserData(JSON.parse(storedData));
    }

    const storedProfileImage = localStorage.getItem('profileImage');
    if (storedProfileImage) {
      setProfileImage(storedProfileImage);
    }

    const handleStorageChange = (event) => {
      if (event.key === 'profileImage') {
        setProfileImage(event.newValue);
      }
      if (event.key === 'userData') {
        try {
          setUserData(JSON.parse(event.newValue));
        } catch (error) {
          console.error("Error parsing updated userData from localStorage in AppHeader:", error);
          setUserData(null);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setIsNotificationsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const user = userData;

  const handleUserIconClick = () => {
    setIsNotificationsOpen(false);
    setIsDropdownOpen(prev => !prev);
  };

  const handleNotificationsClick = () => {
    setIsDropdownOpen(false);
    setIsNotificationsOpen(prev => !prev);
  };

  const handleLogout = () => {
    localStorage.removeItem('userData');
    localStorage.removeItem('profileImage');
    setUserData(null);
    setProfileImage(null);
    setIsDropdownOpen(false);
    navigate('/', { replace: true });
    alert("Logged out successfully!");
  };

  const handleProfileClick = () => {
    setIsDropdownOpen(false);
    navigate('/ProfilePage');
  };

  return (
    <header className="flex items-center justify-between p-4 bg-white shadow-md rounded-bl-lg transition-all duration-300 relative z-10">
      <div className="flex items-center">
        <button
          onClick={onMenuToggle}
          className="mr-4 p-2 rounded-md bg-gray-100 hover:bg-gray-200 transition"
          aria-label="Toggle menu"
        >
          {isSidebarOpen ? (
            <X className="w-6 h-6 text-red-600" />
          ) : (
            <Menu className="w-6 h-6 text-red-600" />
          )}
        </button>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative" ref={notificationRef}>
          <button
            onClick={handleNotificationsClick}
            className="relative p-2 rounded-full hover:bg-gray-100"
            aria-label="Notifications"
          >
            <Bell className="w-6 h-6 text-red-600 cursor-pointer hover:text-red-800" />
            {unreadCount > 0 && (
              <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                {unreadCount}
              </span>
            )}
          </button>
          <NotificationPanel
            isOpen={isNotificationsOpen}
            onClose={() => setIsNotificationsOpen(false)}
            onNotificationRead={() => setUnreadCount(0)}
            onUnreadCountChange={setUnreadCount}
          />
        </div>

        {/* User Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <div
            className="flex items-center space-x-2 cursor-pointer"
            onClick={handleUserIconClick}
            aria-haspopup="true"
            aria-expanded={isDropdownOpen}
          >
            {profileImage ? (
              <img
                src={profileImage}
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover border-2 border-red-600"
              />
            ) : (
              <img
                src={defaultPublicProfileIcon}
                alt="Default Profile"
                className="w-8 h-8 rounded-full object-cover border-2 border-red-600"
              />
            )}
            <span className="text-gray-700 font-medium">{user?.user?.role_type || 'Guest'}</span>
          </div>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 focus:outline-none">
              <button
                onClick={handleProfileClick}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                role="menuitem"
              >
                Profile
              </button>
              <div className="border-t border-gray-100 my-1"></div>
              <button
                onClick={handleLogout}
                className="block px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left font-medium"
                role="menuitem"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default AppHeader;