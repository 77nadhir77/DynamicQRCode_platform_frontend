import { createContext, FormEvent, useContext, useEffect, useState } from "react";
import { User } from "@/utils/User";
import {jwtDecode} from 'jwt-decode';
import authTokenType from "@/utils/authTokenType";

import axios from "axios";

type UserContextType = {
    user:User | null,
    setUser : React.Dispatch<React.SetStateAction<User | null>>,
    authTokens: authTokenType | null,
    setAuthTokens: React.Dispatch<React.SetStateAction<authTokenType|null>>,
    loginUser: (arg0: FormEvent<HTMLFormElement>) => void,
    logoutUser: () => void,
    setIsFetching: React.Dispatch<React.SetStateAction<boolean>>,
}

const Usercontext = createContext<UserContextType|undefined>(undefined)


type UserProviderProps = {
    children: React.ReactNode;
};



export const UserProvider:React.FC<UserProviderProps> = ({children}) => {

    const token: string | null = localStorage.getItem("authTokens")
    const [authTokens, setAuthTokens] = useState<authTokenType|null>(token? JSON.parse(token) : null)
    const [user, setUser] = useState<User|null>(token? jwtDecode<User>(authTokens?.accessToken as string) : null)
    const [isFetching, setIsFetching] = useState<boolean>(false)

    const loginUser = async (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        setIsFetching(true)
        const form = e.target as HTMLFormElement
        const username = (form.elements.namedItem('username') as HTMLInputElement).value
        const password = (form.elements.namedItem('password') as HTMLInputElement).value
        await axios.post(`${import.meta.env.VITE_APP_BACKEND_URL}/login`, {
            "username": username,
            "password": password,
        })
        .then(response => {
            setAuthTokens(response.data)
            setUser(jwtDecode(response.data.accessToken))
            localStorage.setItem('authTokens', JSON.stringify(response.data))
        })
        .catch(err => console.error(err.message))
        .finally(() => {
            setIsFetching(false)
        })

    }

    const logoutUser = () => {
        localStorage.clear()
        setAuthTokens(null)
        setUser(null)
    }

    useEffect(()=>{
        if(authTokens){
            setUser(jwtDecode<User>(String(authTokens.accessToken)))
        }
    },[authTokens, token])

    const contextValue = {
        user, 
        setUser, 
        authTokens, 
        setAuthTokens , 
        loginUser, 
        logoutUser, 
        setIsFetching
    }

    return(
        <Usercontext.Provider value={contextValue}>
            {
            isFetching
            ?
            (<div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="relative">
                    <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-blue-500"></div>
                    <div className="absolute top-0 left-0 h-32 w-32 flex items-center justify-center text-blue-500 text-2xl font-semibold">
                        Loading
                    </div>
                </div>
            </div>)
            : 
                children
            }
        </Usercontext.Provider>
    )
}

export const useUserContext = () => {
    const context = useContext(Usercontext)

    if (context === undefined) {
        throw new Error('useUserContext must be used within a UserProvider');
    }

    return context;
}