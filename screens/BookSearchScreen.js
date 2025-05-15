import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import SearchBar from '../components/SearchBar';
import BookCard from '../components/BookCard'; // ✅ Import BookCard
import { Provider as PaperProvider } from 'react-native-paper';

export default function BookSearchScreen({ route }) {
  const { query, results } = route.params;
  const [searchText, setSearchText] = useState(query);

  return (
    <PaperProvider>
      <View style={styles.container}>
        <SearchBar
          searchText={searchText}
          setSearchText={setSearchText}
        />
        <Text style={styles.text}>Search Results for: {query}</Text>
        <Text style={styles.resultCount}>{results.length} result(s) found</Text>

        {results.length === 0 ? (
          <Text style={styles.text}>No results found.</Text>
        ) : (
          <FlatList
            data={results}
            keyExtractor={(item) => item.workID.toString()}
            renderItem={({ item }) => <BookCard item={item} />}
            contentContainerStyle={styles.resultsContainer}
          />
        )}
      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3D3D3D',
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  text: {
    color: '#FAFAFA',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  resultCount: {
    color: '#B7B7B7',
    fontSize: 16,
    marginBottom: 20,
  },
  resultsContainer: {
    paddingBottom: 20,
  },
});
