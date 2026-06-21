// This script helps identify which accounts have secrets configured
// Run this in GitHub Actions to see which secrets are set

const accounts = Array.from({ length: 33 }, (_, i) => i + 1);
const previewLength = 33;

console.log('Checking configured accounts...\n');

for (const account of accounts) {
  const secretName = `LITMEDIA_STORAGE_STATE_BASE64_${account}`;
  const secretValue = process.env[secretName];
  
  if (secretValue) {
    // Only show the edges to help identify uniqueness without printing the full secret.
    const preview = secretValue.length > previewLength * 2 
      ? `${secretValue.slice(0, previewLength)}...${secretValue.slice(-previewLength)} (length: ${secretValue.length})`
      : `(length: ${secretValue.length})`;
    
    console.log(`✓ Account ${account}: ${secretName} is configured ${preview}`);
  } else {
    console.log(`✗ Account ${account}: ${secretName} is NOT configured`);
  }
}

// Check for duplicates by comparing lengths and preview
console.log('\n--- Checking for potential duplicates ---');
const configured = {};

for (const account of accounts) {
  const secretName = `LITMEDIA_STORAGE_STATE_BASE64_${account}`;
  const secretValue = process.env[secretName];
  
  if (secretValue) {
    const key = `${secretValue.length}-${secretValue.slice(0, previewLength)}-${secretValue.slice(-previewLength)}`;
    if (!configured[key]) {
      configured[key] = [];
    }
    configured[key].push(account);
  }
}

for (const [key, accounts] of Object.entries(configured)) {
  if (accounts.length > 1) {
    console.log(`⚠️  DUPLICATE DETECTED: Accounts ${accounts.join(', ')} have identical secrets`);
  }
}

console.log('\nCheck complete!');
