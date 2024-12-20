const Jimp = require('jimp');
const QRCode = require('qrcode-reader');
const fetch = require('node-fetch');
const jsQR = require('jsqr');
const { createCanvas, loadImage } = require('canvas');

const BASE_URL = 'http://localhost:3000/api';
const userId = 'dbbb8ed1-a2b1-40a2-b0e8-847a350651a3'; // Using the provided user ID
// one time screen, no way to go back to the home screen
// user upload image that is stored on userside not server 

// Utility function for logging
function log(...args) {
  console.log(...args);
}

// Test QR Code Generation
async function testGenerateQR() {
  try {
    log('\nTesting QR Code Generation...\n');
    const url = `${BASE_URL}/qr/generate/${userId}`;
    log(`Making request to: ${url}\n`);
    
    const response = await fetch(url);
    log(`Response status: ${response.status}\n`);
    const data = await response.json().catch(e => ({ error: 'Failed to parse JSON response' }));
    log('Response data:', data);
    log('\n');

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}, message: ${JSON.stringify(data)}`);
    }
    
    if (!data.qrImage) {
      throw new Error('QR code generation failed: No QR image in response');
    }

    log('✅ QR Code Generation Test Passed', {
      status: response.status,
      hasQRImage: !!data.qrImage,
      timestamp: new Date().toISOString()
    });
    log('\n');

    return data.qrImage;
  } catch (error) {
    log('❌ QR Code Generation Test Failed:', error.message);
    throw error;
  }
}

// Decode QR code image to get the encrypted payload
async function decodeQRCode(qrImage) {
  try {
    log('Decoding QR Code...\n');
    
    // Extract base64 data from data URL
    const base64Data = qrImage.split(',')[1];
    
    // Convert base64 to buffer
    const imageBuffer = Buffer.from(base64Data, 'base64');
    
    // Use QR code library to decode
    // Read image using Jimp
    const image = await Jimp.read(imageBuffer);
    
    // Create QR code reader instance
    const qr = new QRCode();
    
    // Decode QR code
    const decoded = await new Promise((resolve, reject) => {
      qr.callback = (err, value) => err ? reject(err) : resolve(value);
      qr.decode(image.bitmap);
    });
    
    log('✅ QR Code Decoding Successful\n');
    return decoded.result;
  } catch (error) {
    log('❌ QR Code Decoding Failed:', error.message);
    throw error;
  }
}

// Decode QR code image to get the encrypted payload using jsQR
async function decodeQRCodeJsQR(qrImage) {
  try {
    log('Decoding QR Code...\n');
    
    // Load image data
    const image = await loadImage(qrImage);
    
    // Create canvas and draw image
    const canvas = createCanvas(image.width, image.height);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(image, 0, 0);
    
    // Get image data
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    
    // Decode QR code
    const decoded = jsQR(imageData.data, imageData.width, imageData.height);
    
    if (!decoded) {
      throw new Error('Failed to decode QR code');
    }
    
    log('✅ QR Code Decoding Successful\n');
    return decoded.data;
  } catch (error) {
    log('❌ QR Code Decoding Failed:', error.message);
    throw error;
  }
}

// Test QR Code Validation
async function testValidateQR(encryptedPayload) {
  try {
    log('Testing QR Code Validation...\n');
    const url = `${BASE_URL}/qr/validate`;
    log(`Making request to: ${url}\n`);
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ encryptedPayload })
    });

    log(`Response status: ${response.status}\n`);
    const data = await response.json().catch(e => ({ error: 'Failed to parse JSON response' }));
    log('Response data:', data);
    log('\n');

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}, message: ${JSON.stringify(data)}`);
    }
    
    // Validate the response structure
    if (!data.success || !data.user || data.user.id !== userId) {
      throw new Error('QR code validation returned incorrect user data');
    }

    log('✅ QR Code Validation Test Passed', {
      status: response.status,
      userId: data.user.id,
      fullName: data.user.fullName
    });
    log('\n');
  } catch (error) {
    log('❌ QR Code Validation Test Failed:', error.message);
    throw error;
  }
}

// Test QR Code Generation with Invalid User ID
async function testGenerateQRInvalidUser() {
  try {
    log('Testing QR Code Generation with Invalid User ID...\n');
    const invalidUserId = 'invalid-user-id';
    const url = `${BASE_URL}/qr/generate/${invalidUserId}`;
    log(`Making request to: ${url}\n`);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    log(`Response status: ${response.status}\n`);
    const data = await response.json().catch(e => ({ error: 'Failed to parse JSON response' }));
    log('Response data:', data);
    log('\n');

    if (response.status === 404) {
      log(' Invalid User QR Generation Test Passed - Received expected 404\n');
    } else {
      throw new Error(`Expected 404, got ${response.status}`);
    }
  } catch (error) {
    log(' Invalid User QR Generation Test Failed:', error.message);
    throw error;
  }
}

// Test QR Code Generation and Validation
async function testQRCodeAPI() {
  log('\n Starting QR Code API Tests...\n');
  log(`Using API URL: ${BASE_URL}\n`);

  try {
    // Test QR Code Generation
    const qrImage = await testGenerateQR();
    
    // Decode QR code to get the encrypted payload
    const qrData = await decodeQRCodeJsQR(qrImage);
    
    // Test QR Code Validation with the decoded payload
    await testValidateQR(qrData);
  } catch (error) {
    log('\n Test execution failed:\n', error.message);
    process.exit(1);
  }
}

// Run all tests
async function runQRTests() {
  try {
    log(' Starting QR Code API Tests...\n');
    log(`Using API URL: ${BASE_URL}\n`);

    // Test QR Code Generation and Validation
    await testQRCodeAPI();
    
    // Test QR generation with invalid user
    await testGenerateQRInvalidUser();

    log(' All QR Code tests completed\n');
  } catch (error) {
    log(' Test execution failed:\n', error.message);
    process.exit(1);
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  runQRTests();
}