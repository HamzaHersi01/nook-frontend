import React, { useContext } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import StatusDropdownButton from './StatusDropdownButton';
import { AuthContext } from '../context/AuthContext';

export default function BookCard({ item }) {
  const navigation = useNavigation();
  const { userData } = useContext(AuthContext); // Access user token for status updates

  // Navigate to the BookDetails screen when card is pressed
  const handleCardPress = () => {
    navigation.navigate('BookDetails', {
      workID: item.workID.replace('/works/', ''),
      title: item.title,
      first_publish_year: item.first_publish_year,
      number_of_pages_median: item.number_of_pages_median,
      bookAuthor: item.author_name?.[0] || 'Unknown Author',
    });
  };

  return (
    <TouchableOpacity style={styles.resultCard} onPress={handleCardPress}>
      {/* Book Cover */}
      <Image source={{ uri: item.smallCoverURL }} style={styles.coverImage} />

      {/* Book Info Section */}
      <View style={styles.bookInfo}>
        <Text style={styles.bookTitle}>{item.title}</Text>
        <Text style={styles.bookAuthor}>{item.author_name?.[0]}</Text>
        <Text style={styles.bookMeta}>
          {item.first_publish_year ? `Published: ${item.first_publish_year}` : ''}
          {item.number_of_pages_median ? `  •  Pages: ${item.number_of_pages_median}` : ''}
        </Text>

        {/* Status Dropdown Button */}
        <View style={styles.buttonContainer}>
          <View style={styles.buttonRow}>
            <StatusDropdownButton 
              workID={item.workID.replace('/works/', '')} 
              authToken={userData?.token} 
            />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

// Styling for the book card layout
const styles = StyleSheet.create({
  resultCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#888',
  },
  coverImage: {
    width: 140,
    height: 220,
    borderRadius: 4,
    marginRight: 15,
  },
  bookInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  bookTitle: {
    color: '#FAFAFA',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  bookAuthor: {
    color: '#B7B7B7',
    fontSize: 14,
    marginBottom: 4,
  },
  bookMeta: {
    color: '#B7B7B7',
    fontSize: 13,
    marginBottom: 10,
  },
  buttonContainer: {
    marginTop: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
