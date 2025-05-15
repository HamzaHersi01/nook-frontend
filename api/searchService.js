import axios from 'axios';

const BASE_URL = 'http://192.168.0.20:3001';


export const searchBooksByQuery = async (query) => {
  if (!query) return [];

  try {
    const response = await axios.get(`${BASE_URL}/search/title/${encodeURIComponent(query)}`);
    return response.data;
  } catch (error) {
    console.error('Error searching books:', error);
    return [];
  }
};
