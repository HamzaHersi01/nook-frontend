import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Create the authentication context
export const AuthContext = createContext();

// AuthProvider component wraps the app and provides authentication state
export const AuthProvider = ({ children }) => {
  const [userData, setUserData] = useState(null); // Stores the current user's data
  const [isLoading, setIsLoading] = useState(true); // Indicates whether authentication state is still loading

  // Load user data from AsyncStorage when the provider mounts
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userJson = await AsyncStorage.getItem('userData'); // Retrieve stored user data
        if (userJson) {
          setUserData(JSON.parse(userJson)); // If data exists, parse and set it
        }
      } catch (e) {
        console.error('Failed to load user data', e); // Handle any read errors
      } finally {
        setIsLoading(false); // Loading complete
      }
    };

    loadUserData(); // Execute the loading function
  }, []);

  // Function to sign in a user and store their data
  const signIn = async (user) => {
    try {
      await AsyncStorage.setItem('userData', JSON.stringify(user)); // Save user data to storage
      setUserData(user); // Set user data in state
    } catch (e) {
      console.error('Error saving user data', e); // Handle any write errors
    }
  };

  // Function to sign out a user and clear their stored data
  const signOut = async () => {
    try {
      await AsyncStorage.removeItem('userData'); // Remove user data from storage
      setUserData(null); // Clear user data from state
    } catch (e) {
      console.error('Error removing user data', e); // Handle any removal errors
    }
  };

  // Provide the authentication context to child components
  return (
    <AuthContext.Provider value={{ userData, signIn, signOut, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
