import React, { useContext } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen() {
  const { userData, signOut } = useContext(AuthContext);

  if (!userData) {
    return null; // Prevents error from accessing token on null
  }

  const handleSignOut = () => {
    signOut();
  };

  return (
    <View style={styles.container}>
      {/* Profile Icon */}
      <Ionicons name="person-circle-outline" size={100} color="#FAFAFA" style={styles.icon} />

      {/* Email */}
      <Text style={styles.email}>{userData.email}</Text>

      {/* Sign Out Button */}
      <View style={styles.buttonContainer}>
        <Button title="Sign Out" onPress={handleSignOut} color="#02C8FF" />
      </View>
    </View>
  );
}

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
