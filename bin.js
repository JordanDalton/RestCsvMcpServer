#!/usr/bin/env node
import { execSync } from 'child_process';
// This is the entry point that will be executed when someone runs your command with npx
console.log('Starting build process...');

// You can import any build logic from other files if needed
// const { runBuild } = require('./index.js');

// Or simply put your build logic directly here
function runBuild() {
  try {
    // Your build process here
    console.log('Building the project...');
    
    // Execute the build command - modify this to match your actual build command
    execSync('npm run build', { stdio: 'inherit' });
    
    console.log('Build completed successfully!');
    return true;
  } catch (error) {
    console.error('Build failed:', error.message);
    process.exit(1);
  }
}

// Run the build process
runBuild();