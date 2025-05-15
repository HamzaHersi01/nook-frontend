import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

// Import screen components
import BookSearchScreen from '../screens/BookSearchScreen';
import BookDetailsScreen from '../screens/BookDetailsScreen';
import MyLibraryScreen from '../screens/MyLibraryScreen';
import ProfileScreen from '../screens/ProfileScreen';
import HomeScreen from '../screens/HomeScreen';
import ScanISBNScreen from '../screens/ScanISBNScreen';

const Stack = createNativeStackNavigator(); // For screens stacked on top of tabs
const Tab = createBottomTabNavigator(); // For the bottom tab bar

// Defines the tab bar with icons and screen routes
function Tabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false, // Hide header for all tab screens
        tabBarStyle: {
          backgroundColor: '#3D3D3D',
          borderTopColor: '#2C2C2C',
        },
        tabBarActiveTintColor: '#02C8FF',
        tabBarInactiveTintColor: '#B7B7B7',
        tabBarIcon: ({ focused, color, size }) => {
          // Set tab bar icon based on the route name and focus state
          let iconName;
          if (route.name === 'Home') iconName = focused ? 'home' : 'home-outline';
          else if (route.name === 'Goal') iconName = focused ? 'medal' : 'medal-outline'; // Note: Goal tab is unused here
          else if (route.name === 'Library') iconName = focused ? 'library' : 'library-outline';
          else if (route.name === 'Profile') iconName = focused ? 'person' : 'person-outline';
          else if (route.name === 'Search') iconName = focused ? 'search' : 'search-outline';

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      {/* Tab screens */}
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen
        name="Search"
        component={BookSearchScreen}
        initialParams={{ query: '', results: [] }}
      />
      <Tab.Screen name="Library" component={MyLibraryScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

// Stack navigator to support navigation to non-tab screens
export default function MainTabNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* Tabs as the main entry point */}
      <Stack.Screen name="Tabs" component={Tabs} />

      {/* Screens that appear on top of tab navigation */}
      <Stack.Screen
        name="BookDetails"
        component={BookDetailsScreen}
        options={{ headerShown: true, title: 'Book Details' }}
      />
      <Stack.Screen
        name="ScanISBN"
        component={ScanISBNScreen}
        options={{ headerShown: true, title: 'Scan ISBN' }}
      />
    </Stack.Navigator>
  );
}
