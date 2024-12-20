const BASE_URL = 'http://localhost:3000/api';
let userId = null;

// Utility function for logging
const log = (message, data) => {
  console.log('\n' + message);
  if (data) console.log(JSON.stringify(data, null, 2));
};

// Test create user
async function testCreateUser() {
  try {
    log('Testing Create User...');
    
    const testUser = {
      email: 'test@example.com',
      name: 'Test User',
      fullName: 'Test User Full Name',
      dateOfBirth: new Date('1990-01-01').toISOString(),
      studentNumber: 'STU' + Math.random().toString(36).substring(7),
      qrSignature: 'initial-signature',
      qrTimestamp: new Date().toISOString(),
      program: 'Computer Science',
      yearOfStudy: 2
    };

    const response = await fetch(`${BASE_URL}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testUser)
    });

    const data = await response.json();
    log(`Status: ${response.status}`, data);

    if (response.ok) {
      userId = data.id; // Save user ID for later tests
      log(' Create User Test Passed');
      return true;
    } else {
      log(' Create User Test Failed:', data.error);
      return false;
    }
  } catch (error) {
    log(' Create User Test Error:', error.message);
    return false;
  }
}

// Test get all users
async function testGetAllUsers() {
  try {
    log('Testing Get All Users...');
    
    const response = await fetch(`${BASE_URL}/users`);
    const data = await response.json();
    
    log(`Status: ${response.status}`, data);

    if (response.ok && Array.isArray(data)) {
      log(' Get All Users Test Passed');
      log(`Total users: ${data.length}`);
      return true;
    } else {
      log(' Get All Users Test Failed');
      return false;
    }
  } catch (error) {
    log(' Get All Users Test Error:', error.message);
    return false;
  }
}

// Test get user by ID
async function testGetUserById() {
  try {
    log('Testing Get User By ID...');
    
    const response = await fetch(`${BASE_URL}/users/${userId}`);
    const data = await response.json();
    
    log(`Status: ${response.status}`, data);

    if (response.ok) {
      log(' Get User By ID Test Passed');
      return true;
    } else {
      log(' Get User By ID Test Failed');
      return false;
    }
  } catch (error) {
    log(' Get User By ID Test Error:', error.message);
    return false;
  }
}

// Test update user
async function testUpdateUser() {
  try {
    log('Testing Update User...');
    
    const updates = {
      fullName: 'Updated Test User',
      email: 'updated@example.com',
      program: 'Software Engineering',
      yearOfStudy: 3
    };

    const response = await fetch(`${BASE_URL}/users/${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });

    const data = await response.json();
    log(`Status: ${response.status}`, data);

    if (response.ok) {
      log(' Update User Test Passed');
      return true;
    } else {
      log(' Update User Test Failed');
      return false;
    }
  } catch (error) {
    log(' Update User Test Error:', error.message);
    return false;
  }
}

// Test delete user
async function testDeleteUser() {
  try {
    log('Testing Delete User...');
    
    const response = await fetch(`${BASE_URL}/users/${userId}`, {
      method: 'DELETE'
    });

    const data = await response.json();
    log(`Status: ${response.status}`, data);

    if (response.ok) {
      log(' Delete User Test Passed');
      // Verify deletion by trying to get the user
      const verifyResponse = await fetch(`${BASE_URL}/users/${userId}`);
      if (verifyResponse.status === 404) {
        log(' User deletion verified');
        return true;
      }
      log(' User still exists after deletion');
      return false;
    } else {
      log(' Delete User Test Failed');
      return false;
    }
  } catch (error) {
    log(' Delete User Test Error:', error.message);
    return false;
  }
}

// Run all tests
async function runUserTests() {
  log('Starting User API Tests...');
  
  // Run tests in sequence
  if (await testCreateUser()) {
    await testGetAllUsers();
    await testGetUserById();
    await testUpdateUser();
    await testDeleteUser();
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  runUserTests().catch(error => {
    console.error('Test execution failed:', error);
  });
}