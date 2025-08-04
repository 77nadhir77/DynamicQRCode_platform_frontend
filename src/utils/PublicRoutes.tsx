import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useUserContext } from '@/context/UserProvider';




const PublicRoutes:React.FC = () => {
    const {user} = useUserContext()

    return user? <Navigate to='/'/> : <Outlet/>
};

export default PublicRoutes;