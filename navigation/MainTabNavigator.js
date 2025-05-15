import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import BookSearchScreen from '../screens/BookSearchScreen';
import BookDetailsScreen from '../screens/BookDetailsScreen';
import MyLibraryScreen from '../screens/MyLibraryScreen';
import ProfileScreen from '../screens/ProfileScreen';
import HomeScreen from '../screens/HomeScreen';
import ScanISBNScreen from '../screens/ScanISBNScreen';
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function Tabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#3D3D3D',
          borderTopColor: '#2C2C2C',
        },
        tabBarActiveTintColor: '#02C8FF',
        tabBarInactiveTintColor: '#B7B7B7',
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Home') iconName = focused ? 'home' : 'home-outline';
          else if (route.name === 'Goal') iconName = focused ? 'medal' : 'medal-outline';
          else if (route.name === 'Library') iconName = focused ? 'library' : 'library-outline';
          else if (route.name === 'Profile') iconName = focused ? 'person' : 'person-outline';
          else if (route.name === 'Search') iconName = focused ? 'search' : 'search-outline';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
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

export default function MainTabNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Tabs" component={Tabs} />
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
