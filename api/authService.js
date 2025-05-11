import AsyncStorage from '@react-native-async-storage/async-storage';
const API_URL = 'http://192.168.0.20:3001/';

export const signIn = async (email, password) => {
  try {
    const response = await fetch(`${API_URL}auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }

    // Store the user data after successful login
    await storeAuthData({
      token: data.token,
      userId: data.user.id,   // Ensure the backend returns the user object with `id` and `email`
      email: data.user.email  // Store email in the user data
    });
    
    return data;
  } catch (error) {
    console.error('Login error:', error);
    throw new Error(error.message || 'Network request failed');
  }
};

export const signUp = async (email, password) => {
  const response = await fetch(`${API_URL}auth/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Signup failed');
  }
};

// Function to store user data in AsyncStorage
const storeAuthData = async (user) => {
  try {
    // Store the full user data as a stringified object in AsyncStorage
    await AsyncStorage.setItem('userData', JSON.stringify(user));
  } catch (e) {
    console.error('Error saving user data', e);
  }
};
