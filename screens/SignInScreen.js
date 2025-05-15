import { useState, useContext } from 'react';
import { View, TextInput, Button, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { signIn as apiSignIn } from '../api/authService'; // Import the signIn function from the API service
import { AuthContext } from '../context/AuthContext'; // Import the authentication context

export default function SignInScreen({ navigation }) {
  const [email, setEmail] = useState(''); // State to track email input
  const [password, setPassword] = useState(''); // State to track password input
  const [error, setError] = useState(''); // State to display any login errors

  const { signIn } = useContext(AuthContext); // Access the context signIn function

  // Function to handle sign-in button press
  const handleSignIn = async () => {
    try {
      const data = await apiSignIn(email, password); // Call API to authenticate user

      // Store user data in context after successful login
      await signIn({
        token: data.token,
        userId: data.user.id,
        email: data.user.email,
      });
    } catch (err) {
      // If there's an error, display the message
      setError(err.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reading Nook</Text>

      {/* Display error message if login fails */}
      {error ? <Text style={styles.error}>{error}</Text> : null}

      {/* Email input field */}
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      {/* Password input field */}
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {/* Sign In button */}
      <Button title="Sign In" onPress={handleSignIn} />

      {/* Link to Sign Up screen */}
      <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
        <Text style={styles.link}>Don't have an account? Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
}

// Styles for the screen components
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
