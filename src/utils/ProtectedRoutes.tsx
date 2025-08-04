import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useUserContext } from '@/context/UserProvider';


interface ProtectedRoutesProps {
    allowedRoles?: String[]
}

const ProtectedRoutes: React.FC<ProtectedRoutesProps> = () => {
    const {user} = useUserContext()

    if(!user){
        return <Navigate to="/login" />
    }
    

    return <Outlet />
};

export default ProtectedRoutes;