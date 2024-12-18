import React, { useState, useEffect } from 'react';
import { 
  SafeAreaView, 
  Text, 
  View, 
  TouchableOpacity, 
  StyleSheet, 
  Platform, 
  StatusBar,
  Dimensions
} from 'react-native';
import { useRouter } from 'expo-router';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Canvas, DiffRect, rect, rrect, Path } from "@shopify/react-native-skia";

const Scan = () => {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const router = useRouter();
  const { width, height } = Dimensions.get('window');

  const innerDimension = 300;
  const cornerLength = 50;
  const cornerWidth = 5;

  const outer = rrect(rect(0, 0, width, height), 0, 0);
  const inner = rrect(
    rect(
      (width - innerDimension) / 2,
      (height - innerDimension) / 2,
      innerDimension,
      innerDimension
    ),
    50,
    50
  );

  const topLeft = {
    x: (width - innerDimension) / 2,
    y: (height - innerDimension) / 2
  };
  const topRight = {
    x: (width + innerDimension) / 2,
    y: (height - innerDimension) / 2
  };
  const bottomLeft = {
    x: (width - innerDimension) / 2,
    y: (height + innerDimension) / 2
  };
  const bottomRight = {
    x: (width + innerDimension) / 2,
    y: (height + innerDimension) / 2
  };

  useEffect(() => {
    (async () => {
      if (!permission?.granted) {
        const status = await requestPermission();
        if (!status.granted) {
          // Handle permission denial
        }
      }
    })();
  }, []);

  const handleBarCodeScanned = ({ data }: { data: string }) => {
    if (scanned) return;
    setScanned(true);
    // Handle scanned QR code data
  };

  const resetScanner = () => {
    setScanned(false);
  };

  if (!permission?.granted) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>No camera access</Text>
        <TouchableOpacity onPress={requestPermission}>
          <Text>Grant Permission</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {Platform.OS === 'android' && <StatusBar hidden />}

      <View style={styles.cameraContainer}>
        <CameraView
          style={StyleSheet.absoluteFillObject}
          facing='back'
          barcodeScannerSettings={{
            barcodeTypes: ['qr', 'pdf417'],
          }}
          onBarcodeScanned={!scanned ? handleBarCodeScanned : undefined}
        >
          <Canvas
            style={
              Platform.OS === "android" 
                ? { flex: 1 } 
                : StyleSheet.absoluteFillObject
            }
          >
            {/* Overlay background */}
            <DiffRect 
              inner={inner} 
              outer={outer} 
              color="black" 
              opacity={0.5} 
            />

            {/* Top Left Corner */}
            <Path 
              path={`M ${topLeft.x} ${topLeft.y} h ${cornerLength} v ${cornerWidth}`}
              color="white"
            />
            <Path 
              path={`M ${topLeft.x} ${topLeft.y} v ${cornerLength} h ${cornerWidth}`}
              color="white"
            />

            {/* Top Right Corner */}
            <Path 
              path={`M ${topRight.x} ${topRight.y} h -${cornerLength} v ${cornerWidth}`}
              color="white"
            />
            <Path 
              path={`M ${topRight.x} ${topRight.y} v ${cornerLength} h -${cornerWidth}`}
              color="white"
            />

            {/* Bottom Left Corner */}
            <Path 
              path={`M ${bottomLeft.x} ${bottomLeft.y} h ${cornerLength} v -${cornerWidth}`}
              color="white"
            />
            <Path 
              path={`M ${bottomLeft.x} ${bottomLeft.y} v -${cornerLength} h ${cornerWidth}`}
              color="white"
            />

            {/* Bottom Right Corner */}
            <Path 
              path={`M ${bottomRight.x} ${bottomRight.y} h -${cornerLength} v -${cornerWidth}`}
              color="white"
            />
            <Path 
              path={`M ${bottomRight.x} ${bottomRight.y} v -${cornerLength} h -${cornerWidth}`}
              color="white"
            />
          </Canvas>
        </CameraView>
      </View>

      {scanned && (
        <TouchableOpacity 
          style={[styles.button, styles.scanAgainButton]}
          onPress={resetScanner}
        >
          <Text style={styles.buttonText}>
            Scan Again
          </Text>
        </TouchableOpacity>
      )}

      {!scanned && (
        <TouchableOpacity 
          style={styles.button}
          onPress={() => {}}
        >
          <Text style={styles.buttonText}>
            Scan QR Code
          </Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff'
  },
  cameraContainer: {
    width: '100%',
    height: '60%',
    position: 'relative'
  },
  button: {
    backgroundColor: '#18171D',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginTop: 32
  },
  scanAgainButton: {
    backgroundColor: '#4CAF50',
    marginTop: 16
  },
  buttonText: {
    color: '#f5fff9',
    textAlign: 'center'
  }
});

export default Scan;