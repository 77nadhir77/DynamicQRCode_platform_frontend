import { useUserContext } from '@/context/UserProvider';
import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { jwtDecode } from 'jwt-decode';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import { useMemo } from 'react';

let refreshTokenPromise: Promise<any> | null = null;

const useAxios = (): AxiosInstance => {
  const baseURL = import.meta.env.VITE_APP_BACKEND_URL;
  const { authTokens, setUser, setAuthTokens } = useUserContext();
  const navigate = useNavigate();

  const axiosInstance = useMemo(() => {
    const instance = axios.create({
      baseURL,
      timeout: 5000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    instance.interceptors.request.use(async (req: InternalAxiosRequestConfig) => {
      const user = authTokens?.accessToken ? jwtDecode(authTokens.accessToken) : null;

      if (authTokens?.accessToken && user) {
        const isExpired = dayjs.unix(user.exp as number).isBefore(dayjs());

        if (isExpired) {
          // If a refresh is already happening, wait for it
          if (!refreshTokenPromise) {
            refreshTokenPromise = axios
              .post(`${baseURL}/token`, { refreshToken: authTokens.refreshToken })
              .then((res) => {
                const newTokens = res.data;
                localStorage.setItem('authTokens', JSON.stringify(newTokens));
                setAuthTokens(newTokens);
                return newTokens;
              })
              .catch((err) => {
                localStorage.removeItem('authTokens');
                setUser(null);
                setAuthTokens(null);
                navigate('/');
                return Promise.reject(err);
              })
              .finally(() => {
                refreshTokenPromise = null;
              });
          }

          try {
            const newTokens = await refreshTokenPromise;
            req.headers.Authorization = `Bearer ${newTokens.accessToken}`;
          } catch (err) {
            return Promise.reject(err);
          }
        } else {
          req.headers.Authorization = `Bearer ${authTokens.accessToken}`;
        }
      }

      return req;
    });

    return instance;
  }, [authTokens, baseURL, navigate, setAuthTokens, setUser]);

  return axiosInstance;
};

export default useAxios;
