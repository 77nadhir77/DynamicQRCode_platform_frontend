import React from 'react';
import { Button } from './ui/button';
import { useUserContext } from '@/context/UserProvider';

const Logout = () => {
  const { logoutUser, user } = useUserContext();

  return user ? (
    <Button
      className="cursor-pointer bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
      onClick={logoutUser}
    >
      Déconnexion
    </Button>
  ) : null;
};

export default Logout;
