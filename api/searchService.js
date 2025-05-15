import axios from 'axios';

const BASE_URL = 'http://192.168.0.20:3001';

// Function to search books by a query string (title)
export const searchBooksByQuery = async (query) => {
  // Return an empty array if the query is empty or undefined
  if (!query) return [];

  try {
    // Send GET request to backend search endpoint with encoded query
    const response = await axios.get(`${BASE_URL}/search/title/${encodeURIComponent(query)}`);

    // Return the array of search results
    return response.data;
  } catch (error) {
    // Log error and return empty array on failure
    console.error('Error searching books:', error);
    return [];
  }
};
