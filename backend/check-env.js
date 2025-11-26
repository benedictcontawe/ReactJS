const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

const envPath = path.resolve(__dirname, '.env');

console.log('=== .env File Diagnostic ===\n');
console.log('1. Checking if .env file exists...');
if (fs.existsSync(envPath)) {
  console.log('   ✓ File exists at:', envPath);
  
  console.log('\n2. Reading file contents...');
  const content = fs.readFileSync(envPath, 'utf8');
  console.log('   File size:', content.length, 'characters');
  console.log('   First 200 characters:');
  console.log('   ' + content.substring(0, 200).replace(/\n/g, '\\n'));
  
  console.log('\n3. Checking for common issues...');
  const lines = content.split('\n');
  let hasProjectId = false;
  let hasClientEmail = false;
  let hasPrivateKey = false;
  let hasErrors = false;
  
  lines.forEach((line, index) => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      if (trimmed.includes('FIREBASE_PROJECT_ID')) {
        hasProjectId = true;
        const value = trimmed.split('=')[1];
        if (!value || value.trim() === '') {
          console.log(`   ✗ Line ${index + 1}: FIREBASE_PROJECT_ID has no value`);
          hasErrors = true;
        } else {
          console.log(`   ✓ Line ${index + 1}: FIREBASE_PROJECT_ID found`);
        }
      }
      if (trimmed.includes('FIREBASE_CLIENT_EMAIL')) {
        hasClientEmail = true;
        const value = trimmed.split('=')[1];
        if (!value || value.trim() === '') {
          console.log(`   ✗ Line ${index + 1}: FIREBASE_CLIENT_EMAIL has no value`);
          hasErrors = true;
        } else {
          console.log(`   ✓ Line ${index + 1}: FIREBASE_CLIENT_EMAIL found`);
        }
      }
      if (trimmed.includes('FIREBASE_PRIVATE_KEY')) {
        hasPrivateKey = true;
        const value = trimmed.split('=')[1];
        if (!value || value.trim() === '') {
          console.log(`   ✗ Line ${index + 1}: FIREBASE_PRIVATE_KEY has no value`);
          hasErrors = true;
        } else if (!value.includes('BEGIN PRIVATE KEY')) {
          console.log(`   ⚠ Line ${index + 1}: FIREBASE_PRIVATE_KEY might be incomplete`);
        } else {
          console.log(`   ✓ Line ${index + 1}: FIREBASE_PRIVATE_KEY found`);
        }
      }
    }
  });
  
  if (!hasProjectId) console.log('   ✗ FIREBASE_PROJECT_ID not found in file');
  if (!hasClientEmail) console.log('   ✗ FIREBASE_CLIENT_EMAIL not found in file');
  if (!hasPrivateKey) console.log('   ✗ FIREBASE_PRIVATE_KEY not found in file');
  
  console.log('\n4. Testing dotenv.config()...');
  const result = dotenv.config({ path: envPath });
  
  if (result.error) {
    console.log('   ✗ Error loading .env:', result.error.message);
  } else {
    console.log('   ✓ dotenv.config() succeeded');
    console.log('\n5. Checking loaded environment variables...');
    console.log('   FIREBASE_PROJECT_ID:', process.env.FIREBASE_PROJECT_ID ? `✓ "${process.env.FIREBASE_PROJECT_ID}"` : '✗ MISSING');
    console.log('   FIREBASE_CLIENT_EMAIL:', process.env.FIREBASE_CLIENT_EMAIL ? `✓ "${process.env.FIREBASE_CLIENT_EMAIL.substring(0, 40)}..."` : '✗ MISSING');
    console.log('   FIREBASE_PRIVATE_KEY:', process.env.FIREBASE_PRIVATE_KEY ? `✓ Found (${process.env.FIREBASE_PRIVATE_KEY.length} chars)` : '✗ MISSING');
  }
  
} else {
  console.log('   ✗ File does NOT exist at:', envPath);
  console.log('   Please create a .env file in the backend/ directory');
}

console.log('\n=== End Diagnostic ===');