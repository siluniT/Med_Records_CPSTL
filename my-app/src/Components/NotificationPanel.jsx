import React, { useState } from 'react';

// Using a single file for all components as per the design guidelines.
const NotificationPanel = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('all');
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'new-patient',
      user: { name: 'Dr. Jane Doe', avatar: 'https://placehold.co/40x40/4CAF50/FFFFFF?text=JD' },
      message: 'New patient registered.',
      subtext: 'A new patient, John Smith, has completed their registration process.',
      time: 'Just now',
      date: 'Sep 10, 2025',
      read: false,
    },
    {
      id: 2,
      type: 'appointment',
      user: { name: 'System Alert', avatar: 'https://placehold.co/40x40/FFC107/FFFFFF?text=SA' },
      message: 'Appointment reminder.',
      subtext: 'Appointment with Sarah Davis scheduled for tomorrow, Sep 11, 2025 at 10:00 AM.',
      time: '30 mins ago',
      date: 'Sep 10, 2025',
      read: false,
    },
    
  ]);

  if (!isOpen) {
    return null;
  }

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const getFilteredNotifications = () => {
    // For this example, "Mentions" tab is not implemented but can be expanded upon.
    return notifications;
  };

  const filteredNotifications = getFilteredNotifications();

  return (
    <div className="absolute right-0 mt-2 w-96 max-h-[80vh] flex flex-col bg-white rounded-xl shadow-2xl ring-1 ring-black ring-opacity-5 z-50 overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">Notifications</h2>
          <button onClick={onClose} className="p-2 -mr-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-700 focus:outline-none">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div className="flex border-b border-gray-200 text-sm font-medium">
          <button
            onClick={() => setActiveTab('all')}
            className={`py-2 px-4 ${activeTab === 'all' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            View all
          </button>
          <button
            onClick={() => setActiveTab('mentions')}
            className={`py-2 px-4 ${activeTab === 'mentions' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Mentions
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-6">
        {filteredNotifications.length > 0 ? (
          <ul>
            {filteredNotifications.map(notification => (
              <li key={notification.id} className="py-4 border-b border-gray-100 last:border-b-0">
                <div className="flex items-start space-x-4 relative group">
                  <img className="h-10 w-10 rounded-full" src={notification.user.avatar} alt={`${notification.user.name}'s avatar`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-800 leading-tight">
                      <span className="font-semibold">{notification.user.name}</span> {notification.message}
                    </p>
                    {notification.subtext && (
                      <p className="mt-1 text-sm text-gray-600 bg-gray-50 p-2 rounded-lg">{notification.subtext}</p>
                    )}
                    {notification.files && (
                      <div className="mt-2 space-y-2">
                        {notification.files.map((file, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                            <div className="flex items-center space-x-2">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
                                <polyline points="14 2 14 8 20 8"></polyline>
                              </svg>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-700 truncate">{file.name}</p>
                                <p className="text-xs text-gray-500">{file.size}</p>
                              </div>
                            </div>
                            <button className="text-gray-400 hover:text-gray-600 p-1">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                <polyline points="7 10 12 15 17 10"></polyline>
                                <line x1="12" y1="15" x2="12" y2="3"></line>
                              </svg>
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="mt-1 flex justify-between items-center text-xs text-gray-400">
                      <span>{notification.time}</span>
                      <span>{notification.date}</span>
                    </div>
                  </div>
                  {!notification.read && (
                    <span className="absolute -top-1 right-0 block h-2.5 w-2.5 rounded-full bg-blue-600"></span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="py-2 text-sm text-gray-500 text-center">No new notifications.</p>
        )}
      </div>

      <div className="flex justify-between items-center p-4 border-t border-gray-100">
        <button
          onClick={handleMarkAllAsRead}
          className="text-gray-500 hover:text-gray-700 flex items-center space-x-1 text-sm font-medium"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-8.56"></path>
            <path d="M22 4L12 14.01l-3-3"></path>
          </svg>
          <span>Mark all as read</span>
        </button>
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-full text-sm shadow-md">
          View all notifications
        </button>
      </div>
    </div>
  );
};

export default NotificationPanel;
