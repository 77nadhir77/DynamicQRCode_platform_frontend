import React from 'react';
import Navbar from '@/components/Navbar';
import { Outlet } from 'react-router-dom';

const ProtectedLayout = () => {
  return (
    <>
      <Navbar />
      <div className="mt-20 px-4">
        <Outlet />
      </div>
    </>
  );
};

export default ProtectedLayout;