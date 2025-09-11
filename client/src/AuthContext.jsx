import { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState({});
    const [loginStatus, setLoginStatus] = useState(false);

    useEffect(() => {
        axios.get(`${API_BASE_URL}/session`, { withCredentials: true }).then(res =>{
            if (!res.ok) {
                return new Error(`HTTP error! status: ${res.status}`);
            }
            return res.json();
        })  .then((data) => {
                if (data.data.LoggedIn) {
                    setUser(data.data.user);
                    setLoginStatus(true);
                } else {
                    setUser(null);
                    setLoginStatus(false);
                }
            })
            .catch((err) => {
                console.error("Error checking session", err);
            });
    }, []);

    const login = (userData) => {
        setUser(userData);
        setLoginStatus(true);
    };

    const logout = async () => {
        await axios.post(`${API_BASE_URL}/logout`, { withCredentials: true });
        setUser(null);
        setLoginStatus(false);
    };
    return (
        <AuthContext.Provider value={{ user, loginStatus, login, logout, setUser, setLoginStatus }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
