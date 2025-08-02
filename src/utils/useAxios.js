import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useMemo } from "react";

const useAxios = () => {
  const baseURL = import.meta.env.VITE_APP_BACKEND_URL;

  const AxiosInstance = useMemo(() => {
    const instance = axios.create({
      baseURL,
      timeout: 5000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // instance.interceptors.request.use(async(req)=> {
    //     // object to store ongoing requests cancel tokens
    //     const pendingRequests = new Map();

    //     // generate an identifier for each request
    //     const requestIdentifier = `${req.url}_${req.method}`;

    //     // check if there is already a pending request with the same identifier
    //     if (pendingRequests.has(requestIdentifier)) {
    //         const cancelTokenSource = pendingRequests.get(requestIdentifier);
    //         // cancel the previous request
    //         cancelTokenSource.cancel('Cancelled due to new request');
    //     }

    //     // create a new CancelToken
    //     const newCancelTokenSource = axios.CancelToken.source();
    //     req.cancelToken = newCancelTokenSource.token;

    //     // store the new cancel token source in the map
    //     pendingRequests.set(requestIdentifier, newCancelTokenSource);

    //     const user:User = jwtDecode<User>(String(authTokens?.accessToken))
    //     const isExpired = dayjs.unix(user.exp as number).isBefore(dayjs());

    //     if(!isExpired) return req

    //     await axios.post(`${baseURL}/token`,
    //         {
    //             refreshToken: authTokens?.refreshToken
    //         }
    //     ).then(response => {
    //         localStorage.setItem('authTokens', JSON.stringify(response.data))
    //         req.headers.Authorization = `Bearer ${response.data.accessToken}`
    //         return req
    //     }).catch(err => {
    //         console.log(err)
    //         localStorage.removeItem('authTokens')
    //         setUser(null)
    //         setAuthTokens(null)
    //         alert("session expired please login again")
    //         navigate('/')
    //     })

    //     return req
    // })
    return instance;
  }, [baseURL]);

  return AxiosInstance;
};

export default useAxios;
