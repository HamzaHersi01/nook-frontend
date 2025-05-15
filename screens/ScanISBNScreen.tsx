import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from 'react-native';
import {
  CameraView,
  useCameraPermissions,
  BarcodeScanningResult,
} from 'expo-camera';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  BookDetails: {
    title: string;
    bookAuthor: string;
    cover: string | null;
    workID: string;
    first_publish_year: number;
    number_of_pages_median: number;
    description: string;
  };
};

export default function ScanISBNScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<'back' | 'front'>('back');
  const [scanned, setScanned] = useState(false);
  const lastScannedData = useRef<string | null>(null);
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  if (!permission) return <View />;
  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.permissionText}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="Grant Permission" />
      </View>
    );
  }

  const handleBarcodeScanned = async ({ data, type }: BarcodeScanningResult) => {
    console.log('Scanned barcode:', data, 'Type:', type);
    lastScannedData.current = data;
    if (scanned) return;

    const isbn = data.replace(/[^0-9X]/g, '');
    if (!/^\d{10}$|^\d{13}$/.test(isbn)) {
      Alert.alert('Invalid Barcode', 'This is not a valid ISBN.');
      return;
    }

    try {
      setScanned(true);
      const response = await fetch(`http://192.168.0.20:3001/search/isbn/${isbn}`);
      if (!response.ok) throw new Error('Book not found');

      const book = await response.json();

      navigation.navigate('BookDetails', {
        title: book.title,
        bookAuthor: book.bookAuthor,
        cover: book.cover,
        workID: book.workID,
        first_publish_year: book.first_publish_year,
        number_of_pages_median: book.number_of_pages_median,
        description: book.description,
      });
    } catch (error) {
      console.error('Failed to fetch book:', error);
      Alert.alert('Error', 'Could not retrieve book info for this ISBN.');
      setScanned(false);
    }
  };

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing={facing}
        onBarcodeScanned={handleBarcodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ['ean13', 'ean8', 'upc_a', 'upc_e'],
        }}
      >
        <View style={styles.overlayBox} />

        <View style={styles.buttonContainer}>
          {scanned && (
            <TouchableOpacity
              style={[styles.button, { backgroundColor: '#fff' }]}
              onPress={() => {
                setScanned(false);
                lastScannedData.current = null;
              }}
            >
              <Text style={[styles.buttonText, { color: '#000' }]}>
                Scan Again
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  overlayBox: {
    position: 'absolute',
    top: '40%',
    left: '10%',
    width: '80%',
    height: 120,
    borderColor: '#02C8FF',
    borderWidth: 2,
    borderRadius: 8,
    zIndex: 10,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 50,
    width: '100%',
    alignItems: 'center',
  },
  button: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#02C8FF',
    width: 160,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  permissionText: {
    color: '#000',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
});
