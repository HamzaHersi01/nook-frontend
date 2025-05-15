import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import axios from 'axios';
import StatusDropdownButton from '../components/StatusDropdownButton';
import { AuthContext } from '../context/AuthContext';

export default function BookDetailsScreen({ route }) {
  // Extract navigation parameters passed from previous screen
  const {
    title,
    workID,
    first_publish_year,
    number_of_pages_median,
    bookAuthor,
  } = route.params;

  const [bookData, setBookData] = useState(null); // Holds full book details
  const [loading, setLoading] = useState(true); // Track loading state
  const [showFullDescription, setShowFullDescription] = useState(false); // Toggle long descriptions

  const { userData } = useContext(AuthContext); // Get user token from context

  // Fetch detailed book info using workID
  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const res = await axios.get(
          `http://192.168.0.20:3001/works/getBookDetails/${workID}`
        );
        setBookData(res.data);
      } catch (err) {
        console.error('Failed to fetch book details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookDetails();
  }, [workID]);

  // Show loading spinner while data is being fetched
  if (loading || !bookData) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#FFF" />
      </View>
    );
  }

  // Toggle between truncated and full description
  const toggleDescription = () => {
    setShowFullDescription((prev) => !prev);
  };

  // Show "Read more" only for long descriptions
  const shouldShowReadMore = bookData.description?.length > 300;

  return (
    <ScrollView style={styles.container}>
      {/* Top section: cover image + meta info */}
      <View style={styles.topSection}>
        <Image source={{ uri: bookData.cover }} style={styles.coverImage} />

        <View style={styles.metaContainer}>
          <Text style={styles.title}>{bookData.title || title}</Text>

          {bookAuthor && <Text style={styles.metaText}>Author: {bookAuthor}</Text>}

          <Text style={styles.metaText}>
            {number_of_pages_median
              ? `Pages: ${number_of_pages_median}`
              : 'Pages: N/A'}{' '}
            •{' '}
            {first_publish_year
              ? `Published: ${first_publish_year}`
              : 'Published: N/A'}
          </Text>

          {/* Status dropdown for changing reading state */}
          <View style={styles.statusButton}>
            <StatusDropdownButton
              workID={workID}
              authToken={userData?.token}
            />
          </View>
        </View>
      </View>

      {/* Divider */}
      <View style={styles.spacer} />

      {/* Description section */}
      <View style={styles.descriptionSection}>
        <Text style={styles.label}>Description:</Text>

        <Text
          style={styles.description}
          numberOfLines={showFullDescription ? undefined : 10}
        >
          {bookData.description || 'No description available.'}
        </Text>

        {shouldShowReadMore && (
          <TouchableOpacity onPress={toggleDescription}>
            <Text style={styles.readMore}>
              {showFullDescription ? 'Show less' : 'Read more'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
}

// Styles for layout and text
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3D3D3D',
    padding: 20,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  topSection: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  coverImage: {
    width: 140,
    height: 220,
    borderRadius: 6,
    marginRight: 15,
  },
  metaContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FAFAFA',
    marginBottom: 5,
  },
  metaText: {
    color: '#B7B7B7',
    fontSize: 14,
    marginBottom: 6,
  },
  statusButton: {
    marginTop: 10,
    width: 180,
    height: 50,
    justifyContent: 'center',
  },
  spacer: {
    height: 1,
    backgroundColor: '#FFFFFF',
    alignSelf: 'stretch',
    marginVertical: 20,
  },
  descriptionSection: {
    paddingBottom: 30,
  },
  label: {
    color: '#B7B7B7',
    fontSize: 16,
    marginBottom: 6,
  },
  description: {
    color: '#FAFAFA',
    fontSize: 15,
    lineHeight: 22,
  },
  readMore: {
    color: '#02C8FF',
    fontWeight: 'bold',
    marginTop: 5,
    fontSize: 14,
  },
});
