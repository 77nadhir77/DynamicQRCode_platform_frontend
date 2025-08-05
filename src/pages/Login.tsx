import React from 'react';
import { useUserContext } from '../context/UserProvider';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import useAxios from '@/utils/useAxios';

const Login:React.FC = () => {
 
  const {loginUser} = useUserContext();
  const api = useAxios();

  const handleEmailCode = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();




  }
  

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Connexion</h2>
        <form onSubmit={loginUser}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
              Nom d'utilisateur
            </label>
            <input
              id="username"
              type="text"
              name='username'
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Mot de passe
            </label>
            <input
              id="password"
              name='password'
              type="password"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="cursor-pointer bg-primary text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Se connecter
            </button>
            <Button className='cursor-pointer text-gray-700 hover:text-gray-500' variant="link"><Link to='/codeverify'>Mot de passe oublié?</ Link></Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;