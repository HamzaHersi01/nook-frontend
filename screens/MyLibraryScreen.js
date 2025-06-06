import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Image,
} from 'react-native';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import StatusDropdownButton from '../components/StatusDropdownButton';
import { useFocusEffect } from '@react-navigation/native';

// Define available book status filters
const FILTERS = ['to-read', 'reading', 'finished', 'paused', 'did not finish'];

export default function MyLibraryScreen() {
  const [selectedFilter, setSelectedFilter] = useState('to-read'); // Default filter
  const [books, setBooks] = useState([]); // All books from backend
  const [loading, setLoading] = useState(true); // Loading state
  const { userData } = useContext(AuthContext); // Auth context for token access

  // Fetch user's books from backend
  const fetchBooks = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://192.168.0.20:3001/userBooks/myBooks', {
        headers: {
          Authorization: `Bearer ${userData.token}`,
        },
      });
      setBooks(res.data);
    } catch (err) {
      console.error('Failed to fetch books:', err);
    } finally {
      setLoading(false);
    }
  };

  // Refresh data when screen is focused
  useFocusEffect(
    React.useCallback(() => {
      if (userData?.token) {
        fetchBooks();
      }
    }, [userData])
  );

  // Filter books based on selected status
  const filteredBooks = books.filter((book) => book.status === selectedFilter);

  // Render filter button for each status
  const renderFilter = (filter) => (
    <TouchableOpacity key={filter} onPress={() => setSelectedFilter(filter)}>
      <Text
        style={[
          styles.filterText,
          selectedFilter === filter && styles.activeFilterText,
        ]}
      >
        {filter.toUpperCase()}
      </Text>
    </TouchableOpacity>
  );

  // Render each book as a card with image and info
  const renderBook = ({ item }) => (
    <View style={styles.bookCard}>
      <Image source={{ uri: item.cover }} style={styles.coverImage} />
      <View style={styles.bookInfo}>
        <Text style={styles.bookTitle}>{item.title}</Text>
        <Text style={styles.metaText}>
          {item.first_publish_year
            ? `Published: ${item.first_publish_year}`
            : 'Published: N/A'}
        </Text>
        <StatusDropdownButton
          initialStatus={item.status}
          workID={item.workID}
          authToken={userData.token}
          onStatusChange={fetchBooks} // Refresh books when status changes
        />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Top filter bar */}
      <View style={styles.filterBar}>{FILTERS.map(renderFilter)}</View>

      {/* Loading, empty, or book list */}
      {loading ? (
        <ActivityIndicator size="large" color="#FFF" style={{ marginTop: 40 }} />
      ) : filteredBooks.length === 0 ? (
        <Text style={styles.noBooksText}>No books in this category.</Text>
      ) : (
        <FlatList
          data={filteredBooks}
          keyExtractor={(item) => item.id}
          renderItem={renderBook}
          contentContainerStyle={styles.bookList}
        />
      )}
    </View>
  );
}

// Screen styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3D3D3D',
    paddingTop: 50,
    paddingHorizontal: 15,
  },
  filterBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    flexWrap: 'wrap',
  },
  filterText: {
    color: '#FAFAFA',
    fontSize: 14,
    fontWeight: 'bold',
    marginHorizontal: 4,
    paddingVertical: 4,
  },
  activeFilterText: {
    color: '#02C8FF',
    textDecorationLine: 'underline',
    fontWeight: 'bold',
  },
  noBooksText: {
    color: '#B7B7B7',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 50,
  },
  bookList: {
    paddingBottom: 20,
  },
  bookCard: {
    backgroundColor: '#525252',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    flexDirection: 'row',
  },
  coverImage: {
    width: 140,
    height: 220,
    borderRadius: 4,
    marginRight: 12,
  },
  bookInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  bookTitle: {
    color: '#FAFAFA',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  metaText: {
    color: '#B7B7B7',
    fontSize: 13,
    marginBottom: 2,
  },
});
