import React, { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../utils/api';

const AuthContext = createContext({});

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const token = localStorage.getItem('admin_token');
        if (token) {

            setUser({ email: 'admin' });
        }
        setLoading(false);
    }, []);

    const signIn = async (username, password) => {
        try {
            const data = await api.login(username, password);
            localStorage.setItem('admin_token', data.token);
            setUser({ email: username });
            return data;
        } catch (error) {
            throw error;
        }
    };

    const signOut = async () => {
        localStorage.removeItem('admin_token');
        setUser(null);
    };

    const value = {
        user,
        loading,
        signIn,
        signOut,
        isAuthenticated: !!user,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
