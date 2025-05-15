import { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View, ActivityIndicator } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper'; // Provides theme and UI components from React Native Paper

import AuthStack from './navigation/AuthStack'; // Stack for authentication screens (Sign In / Sign Up)
import MainTabNavigator from './navigation/MainTabNavigator'; // Main tab navigator after login
import { AuthProvider, AuthContext } from './context/AuthContext'; // Authentication context and provider

const RootStack = createStackNavigator(); // Creates the root stack navigator

function AppNavigator() {
  const { userData, isLoading } = useContext(AuthContext); // Access authentication state

  // Show a loading spinner while checking authentication
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        {userData ? (
          // If the user is authenticated, show the main app
          <RootStack.Screen name="Main" component={MainTabNavigator} />
        ) : (
          // If not authenticated, show the auth screens
          <RootStack.Screen name="Auth" component={AuthStack} />
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
}

// Wrap the app with PaperProvider and AuthProvider
export default function App() {
  return (
    <PaperProvider>
      <AuthProvider>
        <AppNavigator />
      </AuthProvider>
    </PaperProvider>
  );
}
