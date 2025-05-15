import React, { useState } from 'react';
import { TouchableOpacity, View, StyleSheet, Text, Alert } from 'react-native';
import { Menu } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';

export default function StatusDropdownButton({
  initialStatus = 'Add to TBR',
  onChange,
  workID,
  authToken,
  onStatusChange,
}) {
  const [menuVisible, setMenuVisible] = useState(false);
  const [statusLabel, setStatusLabel] = useState(initialStatus);

  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);

  const handleMenuSelection = async (label) => {
    setStatusLabel(label);
    closeMenu();
    if (onChange) onChange(label);

    try {
      const response = await axios.post(
        'http://192.168.0.20:3001/userBooks/addBook',
        { workID, status: label },
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
      console.log('Book added:', response.data);
      if (onStatusChange) {
        onStatusChange(); //Refresh parent list
}
    } catch (err) {
      console.error('Failed to add book:', err);
      Alert.alert('Error', 'Could not update book status.');
    }
  };

  return (
    <View style={styles.statusButtonWrapper}>
      <TouchableOpacity style={styles.statusButton}>
        <Text style={styles.statusButtonLabel} numberOfLines={1} ellipsizeMode="tail">
          {statusLabel}
        </Text>
      </TouchableOpacity>

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

const BUTTON_HEIGHT = 40;
const STATUS_BUTTON_WIDTH = 140;

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
