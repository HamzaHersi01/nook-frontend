import React, { useContext } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { AuthContext } from '../context/AuthContext'; // Context for user info and logout
import { Ionicons } from '@expo/vector-icons'; // Icon library

export default function ProfileScreen() {
  const { userData, signOut } = useContext(AuthContext); // Access current user and logout method

  // Return nothing if user is not logged in (extra safety)
  if (!userData) {
    return null;
  }

  // Handle user sign out
  const handleSignOut = () => {
    signOut(); // Clear user data from context and storage
  };

  return (
    <View style={styles.container}>
      {/* Profile Icon */}
      <Ionicons name="person-circle-outline" size={100} color="#FAFAFA" style={styles.icon} />

      {/* Display user's email */}
      <Text style={styles.email}>{userData.email}</Text>

      {/* Sign Out Button */}
      <View style={styles.buttonContainer}>
        <Button title="Sign Out" onPress={handleSignOut} color="#02C8FF" />
      </View>
    </View>
  );
}

// Styles for layout and appearance
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#3D3D3D',
  },
  icon: {
    marginBottom: 30,
  },
  email: {
    fontSize: 18,
    marginBottom: 30,
    color: '#FAFAFA',
    textAlign: 'center',
  },
  buttonContainer: {
    width: '60%',
    marginTop: 20,
  },
});
