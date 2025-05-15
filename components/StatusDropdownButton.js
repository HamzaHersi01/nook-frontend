import React, { useState } from 'react';
import { TouchableOpacity, View, StyleSheet, Text, Alert } from 'react-native';
import { Menu } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';

export default function StatusDropdownButton({
  initialStatus = 'Add to TBR',     // Default label if no status passed
  onChange,                          // Optional callback when status changes locally
  workID,                            // Book work ID for backend request
  authToken,                         // Auth token from context
  onStatusChange,                    // Optional callback to refresh parent state
}) {
  const [menuVisible, setMenuVisible] = useState(false);       // Tracks menu open/close state
  const [statusLabel, setStatusLabel] = useState(initialStatus); // Display label on button

  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);

  // Handle selecting a status option from the menu
  const handleMenuSelection = async (label) => {
    setStatusLabel(label); // Update button text
    closeMenu();
    if (onChange) onChange(label);

    try {
      // POST status change to backend
      const response = await axios.post(
        'http://192.168.0.20:3001/userBooks/addBook',
        { workID, status: label },
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
      console.log('Book added:', response.data);

      // Trigger optional callback to update UI in parent component
      if (onStatusChange) {
        onStatusChange();
      }
    } catch (err) {
      console.error('Failed to add book:', err);
      Alert.alert('Error', 'Could not update book status.');
    }
  };

  return (
    <View style={styles.statusButtonWrapper}>
      {/* Main button showing current status */}
      <TouchableOpacity style={styles.statusButton}>
        <Text
          style={styles.statusButtonLabel}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {statusLabel}
        </Text>
      </TouchableOpacity>

      {/* Dropdown chevron and menu */}
      <Menu
        visible={menuVisible}
        onDismiss={closeMenu}
        anchor={
          <TouchableOpacity onPress={openMenu} style={styles.dropdownButton}>
            <Ionicons name="chevron-down" size={20} color="#000" />
          </TouchableOpacity>
        }
        contentStyle={styles.menuContent}
      >
        {['to-read', 'reading', 'finished', 'paused', 'did not finish'].map((label) => (
          <Menu.Item key={label} onPress={() => handleMenuSelection(label)} title={label} />
        ))}
      </Menu>
    </View>
  );
}

// Constants for sizing
const BUTTON_HEIGHT = 40;
const STATUS_BUTTON_WIDTH = 140;

// Styles
const styles = StyleSheet.create({
  statusButtonWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 6,
    overflow: 'hidden',
    marginTop: 10,
  },
  statusButton: {
    backgroundColor: '#02C8FF',
    width: STATUS_BUTTON_WIDTH,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: 6,
    borderBottomLeftRadius: 6,
    height: BUTTON_HEIGHT,
    paddingHorizontal: 8,
  },
  statusButtonLabel: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 14,
    textAlign: 'center',
  },
  dropdownButton: {
    backgroundColor: '#02C8FF',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
    borderTopRightRadius: 6,
    borderBottomRightRadius: 6,
    height: BUTTON_HEIGHT,
  },
  menuContent: {
    backgroundColor: '#E0F4FF',
  },
});
