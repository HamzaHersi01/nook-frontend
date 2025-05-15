import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://192.168.0.20:3001/';

// Function to handle user sign-in
export const signIn = async (email, password) => {
  try {
    const response = await fetch(`${API_URL}auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }), // Send credentials in request body
    });

    const data = await response.json();

    if (!response.ok) {
      // If response is not ok, throw error with backend message or fallback
      throw new Error(data.message || 'Login failed');
    }

    // Store the user token and details in AsyncStorage
    await storeAuthData({
      token: data.token,
      userId: data.user.id,
      email: data.user.email,
    });

    return data; // Return response data for further use (e.g., updating context)
  } catch (error) {
    console.error('Login error:', error);
    throw new Error(error.message || 'Network request failed');
  }
};

// Function to handle user sign-up
export const signUp = async (email, password) => {
  const response = await fetch(`${API_URL}auth/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }), // Send credentials in request body
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Signup failed');
  }
};

// Function to save authentication data in AsyncStorage
const storeAuthData = async (user) => {
  try {
    await AsyncStorage.setItem('userData', JSON.stringify(user)); // Save user data as JSON
  } catch (e) {
    console.error('Error saving user data', e); // Handle any storage error
  }
};
