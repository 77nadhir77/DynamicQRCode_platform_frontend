import { useUserContext } from '@/context/UserProvider';
import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { jwtDecode } from 'jwt-decode';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { User } from './User';

const useAxios = (): AxiosInstance => {
  const baseURL = import.meta.env.VITE_APP_BACKEND_URL;
  const { authTokens, setUser, setAuthTokens } = useUserContext();
  const navigate = useNavigate();

  const axiosInstance = axios.create({
    baseURL,
    timeout: 60000,
    headers: { Authorization: `Bearer ${authTokens?.accessToken}` },
  });
  useEffect(() => {
  const requestIntercept = axiosInstance.interceptors.request.use(
    async (req: InternalAxiosRequestConfig) => {
      const user: User = jwtDecode<User>(String(authTokens?.accessToken));

      const isExpired = dayjs.unix(user.exp as number).isBefore(dayjs());
      if (!isExpired) return req;

      try {
        const tokenResponse = await axios.post(`${baseURL}/token`, {
          refreshToken: authTokens!.refreshToken,
        });

        const newTokens = tokenResponse.data;
        localStorage.setItem('authTokens', JSON.stringify(newTokens));
        setAuthTokens(newTokens);

        // ✅ Set new access token on request
        req.headers.Authorization = `Bearer ${newTokens.accessToken}`;
        return req;
      } catch (err) {
        console.error(err);
        localStorage.removeItem('authTokens');
        setUser(null);
        setAuthTokens(null);
        navigate('/');
        return Promise.reject(err);
      }
    }
  );

  return () => {
    axiosInstance.interceptors.request.eject(requestIntercept);
  };
}, [authTokens]);


  return axiosInstance;
};

export default useAxios;
