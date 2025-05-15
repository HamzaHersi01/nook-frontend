import { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
import { signUp } from '../api/authService'; // Import the signUp API function

export default function SignUpScreen({ navigation }) {
  // State variables for user input and error handling
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  // Function to handle sign-up logic
  const handleSignUp = async () => {
    // Check if passwords match
    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    try {
      // Call the sign-up API
      await signUp(email, password);

      // Navigate to SignIn screen after successful sign-up
      navigation.navigate('SignIn');
    } catch (err) {
      // Set error message from the API response
      setError(err.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>

      {/* Display error message if there's an error */}
      {error ? <Text style={styles.error}>{error}</Text> : null}

      {/* Email input */}
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      {/* Password input */}
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {/* Confirm Password input */}
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />

      {/* Sign Up button */}
      <Button title="Sign Up" onPress={handleSignUp} />

      {/* Link to navigate to Sign In screen */}
      <Text 
        style={styles.link}
        onPress={() => navigation.navigate('SignIn')}
      >
        Already have an account? Sign In
      </Text>
    </View>
  );
}

// Style definitions
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#3D3D3D',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#FAFAFA',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
    borderRadius: 5,
    backgroundColor: '#FAFAFA',
    color: '#333',
  },
  error: {
    color: 'red',
    marginBottom: 15,
    textAlign: 'center',
  },
  link: {
    color: '#02C8FF',
    textAlign: 'center',
    marginTop: 20,
  },
});
