import React, { createContext, useEffect, useState } from "react";
import axiosInstance from "../api/axios";

interface User {
        _id: string;
        username: string,
        name: string,
        email: string,
        role?: string,
}

interface AuthContextType {
        isAuth: boolean;
        user: User | null;
        loading: boolean;
        login: (username: string, password: string)=> Promise<void>;
        logout: ()=> Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider : React.FC<{ children: React.ReactNode }> = ({children}) =>{

        const [isAuth, setIsAuth] = useState<boolean>(false);
        const [user, setUser] = useState<User | null>(null);
        const [loading, setLoading] = useState<boolean>(true);

        // Check auth status on mount and after refreshes
        useEffect(() => {
                const verifyAuth = async () => {
                        console.log('Verifying auth on page load/refresh');
                        try {                
                                const response = await axiosInstance.get('/users/verify');
                                console.log('Auth response:', response.data);
                        
                                if (response.data.user) {
                                        setUser(response.data.user);
                                        setIsAuth(true);
                                        console.log('User authenticated:', response.data.user);
                                }
                        } catch (error) {
                                console.log('Auth check failed with status:', error.response?.status);
                                console.error("Auth verification failed:", error);
                                setUser(null);
                                setIsAuth(false);
                        } finally {
                                setLoading(false);
                        }
                };
        
                verifyAuth();
        }, []);

        const login = async (username: string, password: string)=>{
                try{
                        const response = await axiosInstance.post('/users/login', {
                                username,
                                password
                        });

                        setUser(response.data.user);
                        setIsAuth(true);
                        return response.data;
                } catch (error) {
                        console.error('login failed: ', error);
                        throw error;
                }
        };

        const logout = async ()=>{
                try {
                        await axiosInstance.post('/users/logout');
                } catch (error) {
                        console.error('Logout failed:', error);
                } finally {
                        setUser(null);
                        setIsAuth(false);
                }
        };

        return(
                <AuthContext.Provider value={{isAuth, user, loading, login, logout}}>
                        {children}
                </AuthContext.Provider>
        );

}

// Export the context for use in the hook file
export { AuthContext };