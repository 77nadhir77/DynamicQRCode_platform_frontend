import React from 'react';
import { Button } from './ui/button';
import { useUserContext } from '@/context/UserProvider';

const Logout = () => {
  const { logoutUser, user } = useUserContext();

  return user ? (
    <div className="absolute right-4 top-4">
      <Button
        className="cursor-pointer bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
        onClick={logoutUser}
      >
        Logout
      </Button>
    </div>
  ) : null;
};

export default Logout;
