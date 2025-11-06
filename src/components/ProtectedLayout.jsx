import React from 'react';
import Navbar from '@/components/Navbar';
import { Outlet } from 'react-router-dom';

const ProtectedLayout = () => {
  return (
    <>
      <Navbar />
    </>
  );
};

export default ProtectedLayout;