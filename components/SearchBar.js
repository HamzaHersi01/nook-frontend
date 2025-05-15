import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Text,
  Image,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { searchBooksByQuery } from '../api/searchService';

export default function SearchBar() {
  const [searchText, setSearchText] = useState(''); // User input for search
  const [searchResults, setSearchResults] = useState([]); // Top 3 search previews
  const navigation = useNavigation();

  // Clear search input and results when screen regains focus
  useFocusEffect(
    React.useCallback(() => {
      setSearchText('');
      setSearchResults([]);
    }, [])
  );

  // Fetch search results when user types (with debounce)
  useEffect(() => {
    const fetchResults = async () => {
      if (searchText.trim() === '') {
        setSearchResults([]);
        return;
      }

      try {
        const results = await searchBooksByQuery(searchText);
        setSearchResults(results);
      } catch (err) {
        console.error('Search error:', err);
      }
    };

    const timeout = setTimeout(fetchResults, 300); // Debounce to reduce API calls
    return () => clearTimeout(timeout);
  }, [searchText]);

  // Clear search input and preview results
  const handleClear = () => {
    setSearchText('');
    setSearchResults([]);
  };

  // Navigate to full results screen
  const handleSubmit = () => {
    if (searchText.trim() && searchResults.length > 0) {
      navigation.navigate('Search', {
        query: searchText,
        results: searchResults,
      });
      setSearchText('');
      setSearchResults([]);
    }
  };

  // Render individual book result preview
  const renderBookItem = ({ item }) => {
    const handlePress = () => {
      navigation.navigate('BookDetails', {
        workID: item.workID.replace('/works/', ''),
        title: item.title,
        bookAuthor: item.author_name?.[0] || 'Unknown Author',
        first_publish_year: item.first_publish_year,
        number_of_pages_median: item.number_of_pages_median,
      });
      setSearchText('');
      setSearchResults([]);
    };

    return (
      <TouchableOpacity onPress={handlePress} style={styles.resultCard}>
        <Image
          source={{ uri: item.smallCoverURL }}
          style={styles.coverImage}
          resizeMode="cover"
        />
        <View style={styles.bookInfo}>
          <Text style={styles.bookTitle} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={styles.bookAuthor} numberOfLines={1}>
            {item.author_name?.[0]}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.wrapper}>
      {/* Search Input and Icons */}
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          value={searchText}
          onChangeText={setSearchText}
          placeholder="Search for a book"
          placeholderTextColor="#888"
          onSubmitEditing={handleSubmit}
        />
        {/* Navigate to Scan ISBN screen */}
        <TouchableOpacity
          onPress={() => navigation.navigate('ScanISBN')}
          style={styles.iconContainer}
        >
          <Ionicons name="scan-circle-outline" size={30} color="#007bff" />
        </TouchableOpacity>

        {/* Clear input button */}
        <TouchableOpacity onPress={handleClear} style={styles.clearIconContainer}>
          <Ionicons name="close-circle-outline" size={25} color="#888" />
        </TouchableOpacity>
      </View>

      {/* Preview Search Results */}
      {searchResults.length > 0 && searchText.trim() !== '' && (
        <View style={styles.resultsContainer}>
          <FlatList
            data={searchResults.slice(0, 3)} // Only show top 3 results
            keyExtractor={(item, index) => item.workID + index}
            renderItem={renderBookItem}
          />
          <TouchableOpacity onPress={handleSubmit} style={styles.viewAllWrapper}>
            <Text style={styles.viewAll}>View All Results</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

// Styling for layout and components
const styles = StyleSheet.create({
  wrapper: {
    marginHorizontal: 20,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f4f4f4',
    borderRadius: 25,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  input: {
    flex: 1,
    height: 40,
    borderRadius: 8,
    paddingLeft: 10,
    fontSize: 16,
  },
  iconContainer: {
    marginLeft: 10,
  },
  clearIconContainer: {
    marginLeft: 10,
  },
  resultsContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginTop: 10,
  },
  resultCard: {
    flexDirection: 'row',
    marginBottom: 10,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    paddingBottom: 10,
  },
  coverImage: {
    width: 65,
    height: 100,
    marginRight: 10,
    borderRadius: 4,
  },
  bookInfo: {
    flex: 1,
  },
  bookTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#333',
    paddingBottom: 10,
  },
  bookAuthor: {
    fontSize: 14,
    color: '#666',
  },
  viewAllWrapper: {
    alignItems: 'center',
    marginTop: 10,
  },
  viewAll: {
    color: '#007bff',
    fontWeight: '600',
    fontSize: 14,
  },
});
