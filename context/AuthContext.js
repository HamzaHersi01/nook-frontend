import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userJson = await AsyncStorage.getItem('userData');
        if (userJson) {
          setUserData(JSON.parse(userJson));
        }
      } catch (e) {
        console.error('Failed to load user data', e);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, []);

  const signIn = async (user) => {
    try {
      await AsyncStorage.setItem('userData', JSON.stringify(user));
      setUserData(user);
    } catch (e) {
      console.error('Error saving user data', e);
    }
  };

  const signOut = async () => {
    try {
      await AsyncStorage.removeItem('userData');
      setUserData(null);
    } catch (e) {
      console.error('Error removing user data', e);
    }
  };

  return (
    <AuthContext.Provider value={{ userData, signIn, signOut, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};