import { createStackNavigator } from '@react-navigation/stack';
import SignInScreen from '../screens/SignInScreen';
import SignUpScreen from '../screens/SignUpScreen';

// Create a stack navigator instance for authentication flow
const Stack = createStackNavigator();

// This component defines the stack navigation for the auth screens
export default function AuthStack() {
  return (
    <Stack.Navigator 
      screenOptions={{ 
        headerShown: false, // Hides the header on all screens in this stack
        cardStyle: { backgroundColor: '#fff' } // Sets background color for transition cards
      }}
    >
      {/* Sign In screen */}
      <Stack.Screen name="SignIn" component={SignInScreen} />

      {/* Sign Up screen */}
      <Stack.Screen name="SignUp" component={SignUpScreen} />
    </Stack.Navigator>
  );
}
