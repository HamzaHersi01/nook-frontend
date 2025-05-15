import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import SearchBar from '../components/SearchBar';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

export default function HomeScreen() {
  const [books, setBooks] = useState([]); // All user's books
  const [loading, setLoading] = useState(true); // Loading state
  const { userData } = useContext(AuthContext); // Auth context for token
  const navigation = useNavigation(); // Navigation hook

  // Fetch books from backend when screen is focused
  useFocusEffect(
  React.useCallback(() => {
    const fetchBooks = async () => {
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

    if (userData?.token) fetchBooks();
  }, [userData])
);

  // Categorize books by status
  const currentlyReading = books.filter((book) => book.status === 'reading');
  const toBeRead = books.filter((book) => book.status === 'to-read');

  // Renders each book item in horizontal lists
  const renderBook = ({ item }) => (
    <TouchableOpacity
      style={styles.bookCard}
      onPress={() =>
        navigation.navigate('BookDetails', {
          workID: item.workID,
          title: item.title,
          bookAuthor: item.bookAuthor,
          first_publish_year: item.first_publish_year,
          number_of_pages_median: item.number_of_pages_median,
        })
      }
    >
      <Image source={{ uri: item.cover }} style={styles.coverImage} />
      <View style={styles.bookInfo}>
        <Text style={styles.bookTitle}>{item.title}</Text>
        <Text style={styles.bookAuthor}>{item.bookAuthor}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#3D3D3D" />
      <SearchBar />

      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Currently Reading</Text>
        <FlatList
          data={currentlyReading}
          horizontal
          keyExtractor={(item) => item.id}
          renderItem={renderBook}
          contentContainerStyle={styles.horizontalList}
          showsHorizontalScrollIndicator={false}
        />

        <Text style={styles.sectionTitle}>To Be Read</Text>
        <FlatList
          data={toBeRead}
          horizontal
          keyExtractor={(item) => item.id}
          renderItem={renderBook}
          contentContainerStyle={styles.horizontalList}
          showsHorizontalScrollIndicator={false}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3D3D3D',
    paddingTop: 50,
    paddingHorizontal: 15,
  },
  sectionTitle: {
    color: '#FAFAFA',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  horizontalList: {
    paddingBottom: 10,
  },
  bookCard: {
    marginRight: 12,
    width: 120,
  },
  coverImage: {
    width: 120,
    height: 180,
    borderRadius: 6,
    marginBottom: 6,
  },
  bookInfo: {
    alignItems: 'center',
  },
  bookTitle: {
    color: '#FAFAFA',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  bookAuthor: {
    color: '#B7B7B7',
    fontSize: 12,
    textAlign: 'center',
  },
});
