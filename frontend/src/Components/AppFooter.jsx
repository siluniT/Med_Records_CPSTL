import React from 'react';

const AppFooter = () => {
  return (
    <footer className="bg-gray-800 text-white p-2 text-center text-sm mt-auto rounded-tr-lg">
      <p>&copy; {new Date().getFullYear()} Ceylon Petroleum Storage Terminals Limited. All rights reserved.</p>
    </footer>
  );
};

export default AppFooter;